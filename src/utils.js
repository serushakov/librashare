export const getImageUrl = (fileName) =>
  `http://media.mw.metropolia.fi/wbma/uploads/${fileName}`;

export const extractValuesFromFields = (fields) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, field.value]),
  );

export const extractImageMimeType = (filename) => {
  const fileParts = filename.split('.');
  const extension = fileParts[fileParts.length - 1];

  const mimetype = `image/${extension}`;

  if (mimetype === 'image/jpg') {
    return 'image/jpeg';
  }

  return mimetype;
};

export const appIdentifier = 'af411fdc-a636-4237-ab4b-25b94267c7f8';
