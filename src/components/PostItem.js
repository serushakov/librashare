import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';

const PostItem = ({
  title,
  author,
  description,
  imageUrl,
  distance,
  style,
}) => {
  return (
    <View style={{ ...styles.card, ...style }}>
      <Card.Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
        {description}
      </Text>
      <Text style={styles.distance}>{`${distance} km`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  image: {
    borderRadius: 8,
    marginBottom: 8,
    height: 200,
  },
  title: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: -0.32,
  },
  author: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
    marginBottom: 16,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  distance: {
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.07,
  },
});

export default PostItem;
