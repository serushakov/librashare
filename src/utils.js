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

export const appIdentifier = '64c5dc8f-44df-44f8-be7f-6ac77e035cb3';
