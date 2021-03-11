import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import { Platform } from 'react-native';
import { Linking } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Button,
  Divider,
  Text,
  useTheme,
  withTheme,
} from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import { useQuery } from 'react-query';
import { getUserInfo } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';
import { calculateDistanceBetweenPoints, getImageUrl } from '../utils';

const PostItemView = ({ route }) => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();
  const item = route.params;
  const { data: postAuthor, isLoading } = useQuery(
    `${item.user_id}`,
    () => getUserInfo(item.user_id, token),
    {
      onError: (err) => err.response.data.message,
    },
  );

  const [userLocation, setUserLocation] = useState();
  const mapRef = useRef();

  useEffect(() => {
    if (!userLocation) {
      mapRef.current?.setCamera({
        ...item.location,
        altitude: 5000,
        zoom: 15,
      });
    } else {
      mapRef.current?.fitToCoordinates([userLocation, item.location], {
        edgePadding: { top: 32, bottom: 32, left: 32, right: 32 },
        animated: false,
      });
    }
  }, [userLocation, item.location]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.root}>
        <Image
          resizeMode="cover"
          source={{ uri: getImageUrl(item.filename) }}
          style={{
            ...styles.image,
            height: (Dimensions.get('screen').width / 4) * 3,
          }}
        />
        <View style={styles.paddingContainer}>
          <Text h2 style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.author}>
            {`Author: `}
            <Text style={styles.authorName}>{item.author}</Text>
          </Text>

          <Divider style={styles.divider} />
          <Text style={styles.description}>{item.description}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Contact</Text>

          <View style={styles.row}>
            <Icon style={{ marginRight: 8 }} name="user" size={18} />
            {isLoading ? (
              <Text>Loading...</Text>
            ) : (
              <Text style={{ fontSize: 16 }}>
                {postAuthor?.fullName || postAuthor?.username}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              Linking.openURL(`tel:${`0401234567`}`).catch(() => {})
            }
          >
            <Icon style={{ marginRight: 8 }} name="phone" size={18} />
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.platform.ios.primary,
              }}
            >
              0401234567
            </Text>
          </TouchableOpacity>

          <Divider style={styles.divider} />

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text style={{ ...styles.sectionTitle, marginBottom: 8 }}>
                Map
              </Text>
              {userLocation && (
                <Text style={{ marginBottom: 16, fontSize: 12 }}>
                  {`Distance from your location: `}
                  {(
                    calculateDistanceBetweenPoints(
                      userLocation,
                      item.location,
                    ) / 1000
                  ).toFixed(2)}
                  km
                </Text>
              )}
            </View>
            <Button
              type="clear"
              icon={<Icon name="map" size={24} color={theme.colors.primary} />}
              onPress={() =>
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? `http://maps.apple.com?t=m&daddr=${item.location.latitude},${item.location.longitude}`
                    : `https://www.google.com/maps/dir/?api=1&destination=${item.location.latitude},${item.location.longitude}`,
                )
              }
            />
          </View>
        </View>
        <MapView
          ref={mapRef}
          style={{ height: 300 }}
          showsUserLocation
          onUserLocationChange={(e) =>
            setUserLocation(e.nativeEvent.coordinate)
          }
        >
          <Marker coordinate={item.location} />
        </MapView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 32,
  },
  paddingContainer: {
    paddingHorizontal: 16,
  },
  image: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  author: {
    fontSize: 17,
  },
  divider: {
    marginVertical: 16,
  },
  authorName: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default withTheme(PostItemView);
