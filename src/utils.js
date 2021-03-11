export const getImageUrl = (fileName) =>
  `http://media-new.mw.metropolia.fi/wbma/uploads/${fileName}`;

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

// From https://www.movable-type.co.uk/scripts/latlong.html
export const calculateDistanceBetweenPoints = (coordinateA, coordinateB) => {
  const { latitude: lat1, longitude: lon1 } = coordinateA;
  const { latitude: lat2, longitude: lon2 } = coordinateB;

  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
