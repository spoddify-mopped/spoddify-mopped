import SpotifyWebApi from 'spotify-web-api-node';
import App from './App';

export const spotifyApi = new SpotifyWebApi({
    clientId: 'd6d7c9814a064d51b3cedebdb6dd2275',
    clientSecret: 'f4eda3c7b0584cafa20aa6d448a4c60f',
    redirectUri: 'http://localhost:8080/callback'
});

const app = new App(8080);
app.listen();