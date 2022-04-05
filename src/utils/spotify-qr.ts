import { ElementNode, parse } from 'svg-parser';

import { FetchSpotifyQrCodeSvg } from '../clients/spotify-qr/spotify-qr';

const GenerateSpotifyQrCode = async (id: string): Promise<number[]> => {
  const rawSvg = await FetchSpotifyQrCodeSvg(id);

  const doc = parse(rawSvg).children[0] as ElementNode;
  const heights: number[] = new Array<number>();
  for (const child of doc.children as ElementNode[]) {
    if (
      child.type === 'element' &&
      child.tagName === 'rect' &&
      (child.properties['x'] as number) >= 100
    ) {
      heights.push(((child.properties['height'] as number) / 60.0) * 100);
    }
  }

  return heights;
};

export { GenerateSpotifyQrCode };
