import MapView from 'react-native-maps';

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

const markers = [
  {
    lat: 37,
    lon: -121,
  },
];

const Map = () => {
  const [camera, setCamera] = useState();

  return (
    <MapView
      style={styles.map}
      camera={camera}
      // provider="google"
      onUserLocationChange={(e) => {
        setCamera(
          (current) =>
            current ?? {
              center: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              },
              pitch: 0,
              heading: 0,
              altitude: 100000,
              zoom: 7,
            },
        );
      }}
      showsUserLocation
      showsMyLocationButton
    />
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Map;
