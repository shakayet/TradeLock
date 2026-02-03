import sharp from 'sharp';

export const processImage = async (
  buffer: Buffer,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<{ buffer: Buffer; info: sharp.OutputInfo }> => {
  const processed = await sharp(buffer)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFormat('webp', { quality: 80 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: processed.data,
    info: processed.info,
  };
};
