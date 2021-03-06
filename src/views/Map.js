import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Button, Card } from 'react-native-elements';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import Animated, { color, Easing } from 'react-native-reanimated';
import PostItem from '../components/PostItem';

const Map = () => {
  const [userLocation, setUserLocation] = useState();
  const [currentActive, setCurrentActive] = useState(0);

  const [carouselHeight, setCarouselHeight] = useState(0);
  const [paginationHeight, setPaginationHeight] = useState(0);

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

  const carouselY = useRef(new Animated.Value(1000)).current;

  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    Animated.spring(carouselY, {
      stiffness: 200,
      damping: 30,
      mass: 1,
      toValue: showCards ? 0 : 1000,
    }).start();
  }, [showCards]);

  const fitMapToCurrentMarker = () => {
    if (typeof currentActive !== 'number') return;

    const item = markers[currentActive];

    if (!item) return;

    // carouselRef.current.snapToItem(currentActive, true);
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
          bottom: 400,
          left: 16,
          right: 16,
        },
      },
    );
  };

  useEffect(fitMapToCurrentMarker, [currentActive]);

  const bottomSheet = useRef();

  const fitMapToMarkers = () => {
    mapRef.current.fitToCoordinates(
      markers.map((item) => ({
        latitude: item.lat,
        longitude: item.lon,
      })),
    );
  };

  const onBottomSheetChange = (prevIndex, index) => {
    if (index === 0) {
      fitMapToMarkers();
    }

    if (index === 1) {
      fitMapToCurrentMarker();
    }
  };

  useEffect(() => {
    carouselRef.current.snapToItem(currentActive);
  }, [currentActive]);

  useEffect(() => {
    if (showCards) {
      bottomSheet.current?.snapTo(1);
      fitMapToCurrentMarker();
    } else {
      bottomSheet.current?.snapTo(0);
      fitMapToMarkers();
    }
  }, [showCards]);

  console.log(carouselHeight + paginationHeight);

  return (
    <View style={styles.root}>
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

      <BottomSheet
        snapPoints={useMemo(
          () => [-1, carouselHeight + paginationHeight || 400],
          [carouselHeight, paginationHeight],
        )}
        ref={bottomSheet}
        // containerHeight={400}
        animateOnMount
        style={styles.carousel}
        onAnimate={onBottomSheetChange}
      >
        <View style={{ flex: 1 }}>
          <Carousel
            ref={carouselRef}
            layout="default"
            data={markers}
            sliderWidth={Dimensions.get('screen').width}
            itemWidth={Dimensions.get('screen').width}
            onBeforeSnapToItem={(index) => setCurrentActive(index)}
            // onLayout={(event) =>
            //   setCarouselHeight(event.nativeEvent.layout.height)
            // }
            renderItem={({ item, index }) => {
              return (
                <PostItem
                  style={styles.card}
                  title="Around the world in 80 days"
                  author="Jules Verne"
                  imageUrl="https://i.pinimg.com/originals/53/b0/0d/53b00dbc113138aa4c4aad36ddea5f73.jpg"
                  description="Book is in good condition, bought a year ago. Looking to exchange for other Jules Verne books"
                  distance="2.3"
                  id={index}
                />
              );
            }}
          />
          <View
          // onLayout={(event) =>
          //   setPaginationHeight(event.nativeEvent.layout.height)
          // }
          >
            <Pagination
              dotsLength={markers.length}
              activeDotIndex={currentActive ?? -1}
            />
          </View>
        </View>
      </BottomSheet>
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
