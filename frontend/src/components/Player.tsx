import React, { ReactElement, useState, useEffect } from 'react'
import axios from "axios"
import { ReactComponent as Pause } from "../resources/pause-circle-solid.svg"
import { ReactComponent as Play } from "../resources/play-circle-solid.svg"
import { ReactComponent as Next } from "../resources/step-forward-solid.svg"
import { ReactComponent as Prev } from "../resources/step-backward-solid.svg"
import "./Player.css"

import socketIOClient from "socket.io-client";

interface Metadata {
    artist?: string,
    track?: string,
    url?: string
}

export default function Player(): ReactElement {
    const [playing, setPlaying] = useState(false);
    const [metadata, setMetadata] = useState<Metadata>({
        artist: undefined,
        track: undefined,
        url: undefined
    });

    useEffect(() => {
        const socket = socketIOClient("http://localhost:8080");
        socket.on("player", (response) => {
            setPlaying(response.is_playing)
            const meta: Metadata = { artist: response.item.artists.map((artist: any) => artist.name).join(", "), track: response.item.name, url: response.item.album.images[0].url }
            setMetadata(meta)
        });

        refresh();

        return () => {
            socket.close();
        }
    }, [])

    function refresh() {
        axios.get("http://localhost:8080/player/")
            .then((response) => {
                setPlaying(response.data.is_playing)
                const meta: Metadata = { artist: response.data.item.artists.map((artist: any) => artist.name).join(", "), track: response.data.item.name, url: response.data.item.album.images[0].url }
                setMetadata(meta)
            })
            .catch((error) => {
                console.log("EIN FEHLER: " + error)
            })
    }

    function play() {
        axios.post("http://localhost:8080/pause")
            .then((response) => {
                setPlaying(!playing)
            })
    }

    function next() {
        axios.post("http://localhost:8080/forwards")
            .catch((error) => {
                console.log("EIN FEHLER: " + error)
            })
            .finally(() => {
                setTimeout(refresh, 100)
            })
    }

    function prev() {
        axios.post("http://localhost:8080/previous")
            .catch((error) => {
                console.log("EIN FEHLER: " + error)
            })
            .finally(() => {
                setTimeout(refresh, 100)
            })
    }
    return (
        <div className="player">
            <div className="metadata">
                <img className="coverart" src={metadata.url} alt="Cover" />
                <p>{metadata.track}</p>
                <p>{metadata.artist}</p>
            </div>
            <div className="control">
                <button className="button" onClick={prev}><Prev /></button>
                <button className="button pausebutton" onClick={play}>
                    {
                        playing ? <Pause /> : <Play />
                    }
                </button>
                <button className="button" onClick={next}><Next /></button>
            </div>
        </div>
    )
}
