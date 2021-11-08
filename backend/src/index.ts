import SpotifyWebApi from 'spotify-web-api-node';
import express from "express"
import cors from "cors"

let spotifyApi = new SpotifyWebApi({
    clientId: 'd6d7c9814a064d51b3cedebdb6dd2275',
    clientSecret: 'f4eda3c7b0584cafa20aa6d448a4c60f',
    redirectUri: 'http://localhost:8080/callback'
});
var targetDevice: SpotifyApi.UserDevice;

const port = 8080;
const app = express();

app.get("/callback", (req, res) => {
    let token = req.query.code as string;
    res.send("OK");
    spotifyApi.authorizationCodeGrant(token).then((body) => {
        console.log("Got token");
        spotifyApi.setAccessToken(body.body.access_token);
        spotifyApi.setRefreshToken(body.body.refresh_token);
    })
})

app.use(cors())

app.get("/auth", (req, res) => {
    let scopes = ['user-read-playback-state', 'user-modify-playback-state'];
    let url = spotifyApi.createAuthorizeURL(scopes, "some-state");
    res.redirect(url);
})

app.get("/player", (req, res) => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
        res.send(response.body);
    }).catch((error) => {
        res.send(error);
    })
})

app.post("/pause", async (req, res) => {
    if (targetDevice == null) {
        await findDevice();
    }
    spotifyApi.getMyCurrentPlaybackState().then((promise) => {
        if (promise.body.is_playing) {
            spotifyApi.pause({
                device_id: targetDevice.id
            });
        } else {
            spotifyApi.play({
                device_id: targetDevice.id
            });
        }
    })
    res.send({ status: "success" });
})

app.post("/forwards", (req, res) => {
    spotifyApi.skipToNext();
    res.send({ status: "success" });
})

app.post("/previous", (req, res) => {
    spotifyApi.skipToPrevious();
    res.send({ status: "success" });
})

async function findDevice(): Promise<SpotifyApi.UserDevice> {
    let devices = await spotifyApi.getMyDevices();
    for (let device of devices.body.devices) {
        if (device.name === "Spotifyd@archlinux") {
            targetDevice = device;
            return device;
        }
    }
}

app.post("/play", async (req, res) => {
    if (targetDevice == null) {
        await findDevice();
    }
    let uri = req.query["uri"] as string;
    spotifyApi.play({
        device_id: targetDevice.id,
        uris: [uri]
    })
    res.send({ status: "success" });
})

app.post("/queue", async (req, res) => {
    if (targetDevice == null) {
        await findDevice();
    }
    let uri = req.query["uri"] as string;
    spotifyApi.addToQueue(uri, {
        device_id: targetDevice.id
    })
    res.send({ status: "success" });
})

app.post("/search", (req, res) => {
    let query = req.query["query"] as string;
    spotifyApi.searchTracks(query).then((response) => {
        res.send(response.body);
    });
})

app.listen(port, () => {
    console.log("Starting...");
});