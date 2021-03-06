import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Button, Card } from 'react-native-elements';
import Animated, { Easing } from 'react-native-reanimated';

const Map = () => {
  const [userLocation, setUserLocation] = useState();
  const [currentActive, setCurrentActive] = useState(null);

  const markers = useMemo(() => {
    if (!userLocation) return [];

    return new Array(10).fill(0).map((_item, index) => {
      return {
        lat:
          userLocation.latitude +
          Math.random() * 0.5 * (Math.random() < 0.5 ? -1 : 1),
        lon:
          userLocation.longitude +
          Math.random() * 0.5 * (Math.random() < 0.5 ? -1 : 1),
        title: `Marker ${index}`,
      };
    });
  }, [userLocation]);

  const region = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;

  const mapRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.fitToCoordinates(
      markers.map((item) => ({ latitude: item.lat, longitude: item.lon })),
    );
  }, [markers]);

  const carouselY = useRef(new Animated.Value(100)).current;

  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    Animated.spring(carouselY, {
      stiffness: 200,
      damping: 30,
      mass: 1,
      toValue: showCards ? 0 : 100,
    }).start();
  }, [showCards]);

  useEffect(() => {
    if (typeof currentActive !== 'number') return;

    const item = markers[currentActive];

    if (!item) return;

    carouselRef.current.snapToItem(currentActive, true);
    mapRef.current.fitToCoordinates(
      [
        item,
        { lat: item.lat - 0.008, lon: item.lon - 0.008 },
        { lat: item.lat + 0.008, lon: item.lon + 0.008 },
      ].map((coordinate) => ({
        latitude: coordinate.lat,
        longitude: coordinate.lon,
      })),
      {
        edgePadding: {
          top: 16,
          bottom: 200,
          left: 16,
          right: 16,
        },
      },
    );
  }, [currentActive, showCards]);

  return (
    <View style={styles.root}>
      <Animated.View
        style={{ ...styles.carousel, transform: [{ translateY: carouselY }] }}
      >
        <Carousel
          ref={carouselRef}
          layout="tinder"
          data={markers}
          sliderWidth={Dimensions.get('screen').width}
          itemWidth={Dimensions.get('screen').width}
          onBeforeSnapToItem={(index) => setCurrentActive(index)}
          renderItem={({ item, index }) => {
            return (
              <Card key={index} containerStyle={{ borderRadius: 8 }}>
                <Card.Title>{item.title}</Card.Title>
              </Card>
            );
          }}
        />
      </Animated.View>

      <MapView.Animated
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
          mapRef.current.fitToCoordinates(
            markers.map((item) => ({
              latitude: item.lat,
              longitude: item.lon,
            })),
          );
          setCurrentActive(null);
          setShowCards(false);
        }}
        onRegionChange={(newRegion) => region.setValue(newRegion)}
        onUserLocationChange={(e) => {
          setUserLocation(
            (current) =>
              current ?? {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              },
          );
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((item, index) => (
          <Marker
            key={`${item.lat}${item.lon}`}
            coordinate={{ latitude: item.lat, longitude: item.lon }}
            onPress={() => {
              setShowCards(true);
              setCurrentActive(index);
            }}
          />
        ))}
      </MapView.Animated>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative',
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
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  carousel: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    zIndex: 100,
  },
});

export default Map;
