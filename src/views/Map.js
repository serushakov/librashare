import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import usePosts from '../hooks/usePosts';
import MapBottomSheet from '../components/MapBottomSheet';

const Map = () => {
  const [userLocation, setUserLocation] = useState();
  const [mapReady, setMapReady] = useState(false);
  const [currentActive, setCurrentActive] = useState(0);
  const mapRef = useRef(null);
  const [showCards, setShowCards] = useState(false);

  const { data, isLoading, isError } = usePosts();

  const markers = data;

  const region = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

  useEffect(() => {
    if (!mapRef.current || !mapReady || !userLocation) return;

    if (markers.length === 0 && userLocation) {
      region
        .timing({
          useNativeDriver: false,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        })
        .start();
    } else {
      mapRef.current.fitToCoordinates([
        ...markers.map((item) => ({
          ...item.location,
        })),
        userLocation,
      ]);
    }
  }, [markers, mapReady, !!userLocation]);

  const fitMapToCurrentMarker = () => {
    if (typeof currentActive !== 'number') return;

    const item = markers[currentActive];

    if (!item) return;

    mapRef.current.fitToCoordinates(
      [
        item.location,
        {
          latitude: item.location.latitude - 0.008,
          longitude: item.location.longitude - 0.008,
        },
        {
          latitude: item.location.latitude + 0.008,
          longitude: item.location.longitude + 0.008,
        },
      ],
      {
        edgePadding: {
          top: 16,
          bottom: 400,
          left: 16,
          right: 16,
        },
      },
    );
  };

  useEffect(fitMapToCurrentMarker, [currentActive]);

  const fitMapToMarkers = () => {
    mapRef.current.fitToCoordinates(
      markers.map((item) => ({
        latitude: item.location.latitude,
        longitude: item.location.longitude,
      })),
    );
  };

  useEffect(() => {
    if (showCards) {
      fitMapToCurrentMarker();
    } else {
      fitMapToMarkers();
    }
  }, [showCards]);

  console.log(markers);

  return (
    <View style={styles.root}>
      <MapView.Animated
        onMapReady={() => setMapReady(true)}
        ref={mapRef}
        region={region}
        style={styles.map}
        mapPadding={{
          top: 16,
          bottom: 16,
          left: 16,
          right: 16,
        }}
        onPress={(event) => {
          if (event.nativeEvent.action === 'marker-press') return;

          setShowCards(false);
        }}
        onRegionChange={(newRegion) => region.setValue(newRegion)}
        onUserLocationChange={(e) => setUserLocation(e.nativeEvent.coordinate)}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((item, index) => (
          <Marker
            key={`${item.location.latitude}${item.location.longitude}`}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            onPress={() => {
              setShowCards(true);
              setCurrentActive(index);
            }}
          />
        ))}
      </MapView.Animated>
      <MapBottomSheet
        items={markers}
        show={showCards}
        setShow={setShowCards}
        currentActiveIndex={currentActive}
        onCurrentIndexChange={setCurrentActive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    zIndex: 100,
  },
  card: {
    paddingHorizontal: 16,
  },
  carousel: {
    width: '100%',
  },
});

export default Map;
