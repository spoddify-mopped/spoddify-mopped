const loadImages = async (imgSources: string[]) => {
  return await Promise.all(
    imgSources.map((url) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          resolve(img);
        };
        img.src = url;
      });
    })
  );
};

const ImageUtils = {
  collage: async (
    imgSources: string[],
    size: number
  ): Promise<string | undefined> => {
    const images = await loadImages(imgSources);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return undefined;
    }

    const innerSize = size / 2;

    ctx.drawImage(images[0], 0, 0, innerSize, innerSize);
    ctx.drawImage(images[1], innerSize, 0, innerSize, innerSize);
    ctx.drawImage(images[2], 0, innerSize, innerSize, innerSize);
    ctx.drawImage(images[3], innerSize, innerSize, innerSize, innerSize);

    return canvas.toDataURL('image/jpeg');
  },
};

export default ImageUtils;
