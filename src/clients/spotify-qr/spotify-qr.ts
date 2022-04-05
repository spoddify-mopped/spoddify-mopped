import axios from 'axios';

const BASE_URL = `https://www.spotifycodes.com/downloadCode.php`;

const FetchSpotifyQrCodeSvg = async (id: string): Promise<string> => {
  const response = await axios.get<string>(BASE_URL, {
    params: {
      uri: `svg/000000/white/640/spotify:track:${id}`,
    },
  });

  return response.data;
};

export { FetchSpotifyQrCodeSvg };
