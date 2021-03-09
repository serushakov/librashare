import BottomSheet from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';

import locationPin from '../images/location-pin.png';

const LocationPicker = ({ onDone, show, onCancel, location }) => {
  const [region, setRegion] = useState(null);
  const bottomSheet = useRef();
  const mapRef = useRef();
  const [userLocation, setUserLocation] = useState(null);
  const [ignoreLocationUpdateEvents, setIgnoreLocationUpdateEvents] = useState(
    !!location,
  );

  const centerMapOnUserLocation = () => {
    if (!userLocation) return;
    mapRef.current.setCamera({
      center: userLocation,
      altitude: 5000,
      zoom: 15,
    });
  };

  useEffect(() => {
    if (!location) return;

    mapRef.current.setCamera({
      center: location,
      altitude: 5000,
      zoom: 15,
    });
  }, []);

  useEffect(() => {
    if (ignoreLocationUpdateEvents) return;

    centerMapOnUserLocation();
  }, [userLocation]);

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  const handleUserLocaitonChange = (e) => {
    const {
      nativeEvent: { coordinate },
    } = e;
    setUserLocation(coordinate);
    if (!region) {
      setRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  };

  useEffect(() => {
    if (show) {
      bottomSheet.current.expand();
    } else {
      bottomSheet.current.collapse();
    }
  }, [show]);

  return (
    <BottomSheet
      snapPoints={useMemo(() => ['0%', '90%'], [])}
      index={show ? 1 : 0}
      ref={bottomSheet}
      animateOnMount
      enableContentPanningGesture={false}
      handleComponent={() => (
        <View style={styles.header}>
          <View style={styles.cancelButtonContainer}>
            <Button
              buttonStyle={{ padding: 0 }}
              title="Cancel"
              type="clear"
              onPress={onCancel}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Location</Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      )}
      handle
      onChange={(index) => index === 0 && onCancel()}
    >
      <View style={styles.root}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation
            onTouchStart={() => setIgnoreLocationUpdateEvents(true)}
            onUserLocationChange={handleUserLocaitonChange}
          />
          <View style={styles.centerMarker} pointerEvents="none">
            <Image source={locationPin} style={styles.centerMarkerImage} />
          </View>
          <View style={styles.centerButton}>
            <Button
              onPress={() => {
                centerMapOnUserLocation();
                setIgnoreLocationUpdateEvents(false);
              }}
              buttonStyle={styles.centerButtonContainer}
              icon={<Icon name="navigation" size={18} />}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          title="Pick this location"
          onPress={() =>
            onDone({ latitude: region?.latitude, longitude: region?.longitude })
          }
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flex: 1,
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  title: { fontWeight: '600', fontSize: 18 },
  centerButton: {
    position: 'absolute',
    bottom: 30,
    right: 16,
    zIndex: 1000,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  centerButtonContainer: {
    backgroundColor: '#fff',
    padding: 8,
  },
  centerMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  centerMarkerImage: {
    position: 'relative',
    top: -28,
    left: -2,
    width: 64,
    height: 64,
  },
  bottomContainer: {
    padding: 16,
  },
});

export default LocationPicker;
