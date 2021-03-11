import BottomSheet from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable } from 'react-native';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { calculateDistanceBetweenPoints, getImageUrl } from '../utils';
import PostItem from './PostItem';

const MapBottomSheet = ({
  show,
  setShow,
  items,
  currentActiveIndex,
  onCurrentIndexChange,
  onItemPress,
  userLocation,
}) => {
  const bottomSheet = useRef();
  const carouselRef = useRef(null);

  const onBottomSheetChange = (prevIndex, index) => {
    setShow(index === 1);
  };

  useEffect(() => {
    bottomSheet.current?.snapTo(show ? 1 : 0);
  }, [show]);

  useEffect(() => {
    carouselRef.current.snapToItem(currentActiveIndex);
  }, [currentActiveIndex]);

  return (
    <BottomSheet
      snapPoints={useMemo(() => [-1, 380], [])}
      ref={bottomSheet}
      animateOnMount
      style={styles.carousel}
      enableContentPanningGesture={false}
      onAnimate={onBottomSheetChange}
      onChange={(index) => onBottomSheetChange(-1, index)}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Carousel
          ref={carouselRef}
          layout="stack"
          data={items}
          sliderWidth={Dimensions.get('screen').width}
          itemWidth={Dimensions.get('screen').width}
          onBeforeSnapToItem={(index) => onCurrentIndexChange(index)}
          renderItem={({ index }) => {
            const item = items[index];
            return (
              <Pressable onPress={() => onItemPress(item)}>
                <PostItem
                  style={styles.card}
                  title={item.title}
                  author={item.author}
                  imageUrl={getImageUrl(item.filename)}
                  description={item.description}
                  distance={
                    userLocation
                      ? `${(
                          calculateDistanceBetweenPoints(
                            userLocation,
                            item.location,
                          ) / 1000
                        ).toFixed(2)}`
                      : '--'
                  }
                  id={index}
                />
              </Pressable>
            );
          }}
        />
        <View>
          <Pagination
            tappableDots
            carouselRef={carouselRef}
            containerStyle={{ paddingVertical: 16 }}
            dotsLength={items.length}
            activeDotIndex={currentActiveIndex}
          />
        </View>
      </View>
    </BottomSheet>
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

export default MapBottomSheet;
