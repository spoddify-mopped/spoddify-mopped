#!/usr/bin/env python3
from time import sleep
from bleak.backends.characteristic import BleakGATTCharacteristic
from bleak.backends.device import BLEDevice
import requests
import socketio
import json
from bleak import BleakScanner, BleakClient
import asyncio
import xml.etree.ElementTree as ET

sio = socketio.AsyncClient()
playerState = {
    'album': 'Mining High and Low',
    'artist': 'MineCraft Awesome Parodys',
    'track': 'MINE DIAMONDS | miNECRAFT PARODY OF TAKE ON ME'
}
url = 'https://www.spotifycodes.com/downloadCode.php?uri=svg%2F000000%2Fwhite%2F640%2Fspotify%3Atrack%3A'
qrHeight = list()
esp_device_name = 'SMVS'
skipped_esps: set[str] = set()
total_esps: set[str] = set()

spotify_mopped_service_uui = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
spotify_mopped_characteristic_list = {
    '6354e3a8-53ac-11ec-bf63-0242ac130000': 'songInfo',
    '6354e3a8-53ac-11ec-bf63-0242ac130001': 'artistName',
    '6354e3a8-53ac-11ec-bf63-0242ac130002': 'albumName',
    '6354e3a8-53ac-11ec-bf63-0242ac130003': 'id',
    '6354e3a8-53ac-11ec-bf63-0242ac130004': 'vote',
    '6354e3a8-53ac-11ec-bf63-0242ac130005': 'update',
    '6354e3a8-53ac-11ec-bf63-0242ac130006': 'qr'
}

@sio.event
def action(data):
    global playerState, skipped_esps, qrHeight
    responseJson = data['payload']
    playerState['track'] = responseJson['track']
    playerState['artist'] = responseJson['artists'][0]['name']
    for artist in responseJson['artists'][1:]:
        playerState['artist'] += ", " + artist['name']
    playerState['album'] = responseJson['album']['name']
    qrHeight = generate_qr(responseJson['trackId'])
    skipped_esps = set()

def generate_qr(reference):
    r = requests.get(url + reference)
    root = ET.fromstring(r.text)
    heights = list()
    for child in root:
        if child.tag == "{http://www.w3.org/2000/svg}rect" and float(child.attrib['x']) >= 100:
            heights.append(int(float(child.attrib['height']) / 60.0 * 100))
    return heights


async def sockets():
    await sio.connect('http://localhost:8080')
    await sio.wait()

async def refreshBle(device: BLEDevice):
    print("connecting to " + device.address + " ...")
    async with BleakClient(device) as client:
        print("Success")
        services = await client.get_services()
        for service in services:
            if service.uuid == spotify_mopped_service_uui:
                characteristicMap: dict[str, BleakGATTCharacteristic] = {}
                for characteristic in service.characteristics:
                    if characteristic.uuid in spotify_mopped_characteristic_list:
                       characteristicName = spotify_mopped_characteristic_list[characteristic.uuid]
                       characteristicMap[characteristicName] = characteristic
                currentSong = await client.read_gatt_char(characteristicMap['songInfo'])
                skipped = await client.read_gatt_char(characteristicMap['vote'])
                currentSong = currentSong.decode('utf-8')
                if currentSong == playerState['track'] and skipped == "downvote":
                    print("Esp wants to skip")
                    skipped_esps.add(device.address)
                if currentSong != playerState['track']:
                    print("Sending new Song data to esp")
                    await client.write_gatt_char(characteristicMap['artistName'], playerState['artist'].encode('utf-8'))
                    await client.write_gatt_char(characteristicMap['albumName'], playerState['album'].encode('utf-8'))
                    await client.write_gatt_char(characteristicMap['qr'], bytearray(qrHeight))
                    await client.write_gatt_char(characteristicMap['songInfo'], playerState['track'].encode('utf-8'))
                else:
                    print("Esp already has current songinfo. Disconnecting")
                await client.write_gatt_char(characteristicMap['update'], bytes(1));
                await client.disconnect()

                #await client.write_gatt_char(characteristicMap['songInfo'], playerState['track'].encode('utf-8'))

def updateSkips():
    if len(skipped_esps) > 0 and len(skipped_esps) >= len(total_esps) / 2:
        print("More than half voted to skip, skipping...")
        requests.post("http://localhost:8080/api/player/forwards")

async def scan():
    global playerState
    async with BleakScanner() as client:
        while True:
            await client.discover()
            await asyncio.sleep(5)
            print("Scanning for devices")
            for device in client.discovered_devices:
                if device.name == esp_device_name:
                    total_esps.add(device.address)
                    try:
                        print("Found " + device.address)
                        await refreshBle(device)
                    except Exception as e:
                        print("Connection lost: ")
                        print(e)
            updateSkips()

def refreshPlayerState():
    global playerState, qrHeight
    response = requests.get('http://localhost:8080/api/player')
    responseJson = json.loads(response.text)
    print("Init: " + response.text)
    playerState['track'] = responseJson['item']['name']
    playerState['artist'] = responseJson['item']['artists'][0]['name']
    for artist in responseJson['item']['artists'][1:]:
        playerState['artist'] += ", " + artist['name']
    playerState['album'] = responseJson['item']['album']['name']
    qrHeight = generate_qr(responseJson['item']['id'])


async def main():
    refreshPlayerState()
    socket_init = asyncio.create_task(
        sockets())

    update_bles = asyncio.create_task(
        scan())

    await asyncio.gather(
        socket_init, update_bles
    )

asyncio.run(main())

