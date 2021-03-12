import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import usePosts from '../hooks/usePosts';
import MapBottomSheet from './MapBottomSheet';

const Map = ({ navigation, params }) => {
  const [userLocation, setUserLocation] = useState();
  const [mapReady, setMapReady] = useState(false);
  const [currentActive, setCurrentActive] = useState(0);
  const mapRef = useRef(null);
  const [showCards, setShowCards] = useState(false);
  const { data: markers, isLoading } = usePosts(params?.file_id);

  const region = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

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
          bottom: Platform.OS === 'ios' ? 400 : 900,
          left: 16,
          right: 16,
        },
      },
    );
  };

  const fitMapToMarkers = () => {
    if (!markers.length) return;

    mapRef.current.fitToCoordinates(
      markers
        .filter((item) => {
          // Filter out some outliers so that it does not focus on markers too far away
          return (
            item.location.latitude > 59.5 &&
            item.location.latitude < 61 &&
            item.location.longitude > 24 &&
            item.location.longitude < 25
          );
        })
        .map((item) => item.location),
    );
  };

  useEffect(() => {
    if (!mapRef.current || !mapReady || isLoading) return;

    if (showCards) {
      fitMapToCurrentMarker();
    } else {
      setTimeout(fitMapToMarkers, 200);
    }
  }, [showCards, markers, mapReady, isLoading, currentActive]);

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
        showsUserLocation={mapReady}
        onUserLocationChange={(e) => setUserLocation(e.nativeEvent.coordinate)}
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
        userLocation={userLocation}
        items={markers}
        show={showCards}
        setShow={setShowCards}
        currentActiveIndex={currentActive}
        onCurrentIndexChange={setCurrentActive}
        onItemPress={(item) => navigation.navigate('Post', item)}
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
