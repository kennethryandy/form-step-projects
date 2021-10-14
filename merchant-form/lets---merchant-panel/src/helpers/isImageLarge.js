export const isImageLarge = (img) => {
  const filesize = (img.size / 1024 / 1024).toFixed(4);
  if (filesize > 5) {
    return true;
  }
  return false;
};
