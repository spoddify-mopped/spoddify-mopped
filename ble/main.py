#!/usr/bin/env python3
from time import sleep
from bleak.backends.characteristic import BleakGATTCharacteristic
from bleak.backends.device import BLEDevice
import requests
import socketio
import json
from bleak import BleakScanner, BleakClient
import asyncio

sio = socketio.AsyncClient()
playerState = {
    'album': 'Mining High and Low',
    'artist': 'MineCraft Awesome Parodys',
    'track': 'MINE DIAMONDS | miNECRAFT PARODY OF TAKE ON ME'
}
esp_device_name = 'espiss'
skipped_esps: set[str] = set()

spotify_mopped_service_uui = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
spotify_mopped_characteristic_list = {
    '6354e3a8-53ac-11ec-bf63-0242ac130000': 'songInfo',
    '6354e3a8-53ac-11ec-bf63-0242ac130005': 'skip',
    '6354e3a8-53ac-11ec-bf63-0242ac130010': 'update'
}

@sio.event
def action(data):
    global playerState, skipped_esps
    playerState = data['payload']
    skipped_esps = set()


async def sockets():
    await sio.connect('http://localhost:8080')
    await sio.wait()

async def refreshBle(device: BLEDevice):
    print("Trying to connect")
    async with BleakClient(device) as client:
        services = await client.get_services()
        for service in services:
            if service.uuid == spotify_mopped_service_uui:
                print("run")
                characteristicMap: dict[str, BleakGATTCharacteristic] = {}
                for characteristic in service.characteristics:
                    if characteristic.uuid in spotify_mopped_characteristic_list:
                       characteristicName = spotify_mopped_characteristic_list[characteristic.uuid]
                       characteristicMap[characteristicName] = characteristic
                currentSong = await client.read_gatt_char(characteristicMap['songInfo'])
                skipped = await client.read_gatt_char(characteristicMap['skip'])
                currentSong = currentSong.decode('utf-8')
                if currentSong == playerState['track'] and skipped:
                    skipped_esps.add(device.address)
                if currentSong != playerState['track']:
                    await client.write_gatt_char(characteristicMap['songInfo'], playerState['track'].encode('utf-8'))
                await client.write_gatt_char(characteristicMap['update'], bytes(3));
                await client.disconnect()

                #await client.write_gatt_char(characteristicMap['songInfo'], playerState['track'].encode('utf-8'))

async def scan():
    global playerState
    async with BleakScanner() as client:
        while True:
            await client.discover()
            await asyncio.sleep(5)
            for device in client.discovered_devices:
                if device.name == esp_device_name:
                    try:
                        await refreshBle(device)
                    except:
                        print("Connection lost")

def refreshPlayerState():
   global playerState
   response = requests.get('http://localhost:8080/api/player')
   responseJson = json.loads(response.text)
   playerState['track'] = responseJson['item']['name']
   playerState['artist'] = responseJson['item']['artists'][0]['name']
   for artist in responseJson['item']['artists'][1:]:
       playerState['artist'] += ", " + artist['name']
   playerState['album'] = responseJson['item']['album']['name']


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

