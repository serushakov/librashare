import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Card } from 'react-native-elements';
import { max } from 'react-native-reanimated';

const Map = () => {
  const [userLocation, setUserLocation] = useState();
  const [currentActive, setCurrentActive] = useState(0);

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

  useEffect(() => {
    const item = markers[currentActive];

    if (!item) return;

    region
      .spring({
        latitude: item.lat,
        longitude: item.lon,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
        useNativeDriver: false,
        damping: 20,
      })
      .start();
  }, [currentActive]);

  return (
    <View style={styles.root}>
      <View style={styles.carousel}>
        <Carousel
          data={markers}
          onScroll={(e) => {
            const { nativeEvent } = e;
            const itemWidth = nativeEvent.layoutMeasurement.width;

            const itemIndex = Math.round(
              nativeEvent.contentOffset.x / itemWidth,
            );

            const a =
              Math.abs(nativeEvent.contentOffset.x / itemWidth - itemIndex) +
              0.5;

            const item =
              markers[Math.max(Math.min(itemIndex, markers.length - 1), 0)];
            // region.stopAnimation();

            // region
            //   .timing({
            //     longitudeDelta: a,
            //     latitudeDelta: a,
            //     latitude: item.lat,
            //     longitude: item.lon,
            //     useNativeDriver: false,
            //     duration: 0,
            //     isInteraction: true,
            //   })
            //   .start();
          }}
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
      </View>
      <MapView.Animated
        style={styles.map}
        region={region}
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
        {markers.map((item) => (
          <Marker
            key={`${item.lat}${item.lon}`}
            title={item.title}
            coordinate={{ latitude: item.lat, longitude: item.lon }}
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
