// src/screens/ReelsScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height, width } = Dimensions.get('window');

// Initial data (simulate fetching data)
const initialReelsData = [
  {
    id: '1',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    username: 'user1',
    likes: 120,
    comments: 45,
  },
  {
    id: '2',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    username: 'user2',
    likes: 220,
    comments: 78,
  },
];

export default function ReelsScreen() {
  const [reelsData, setReelsData] = useState(initialReelsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setLoading(true);
    }
  });

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLike = (index) => {
    console.log('Liked video at index:', index);
    // Implement like functionality here
  };

  const handleShare = (index) => {
    console.log('Shared video at index:', index);
    // Implement share functionality here
  };

  // Simulate loading more data
  const loadMoreReels = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        const moreReels = [
          {
            id: (reelsData.length + 1).toString(),
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            username: `user${reelsData.length + 1}`,
            likes: 150 + reelsData.length * 10,
            comments: 50 + reelsData.length * 5,
          },
          {
            id: (reelsData.length + 2).toString(),
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            username: `user${reelsData.length + 2}`,
            likes: 250 + reelsData.length * 10,
            comments: 80 + reelsData.length * 5,
          },
        ];
        setReelsData([...reelsData, ...moreReels]);
        setLoadingMore(false);
        setPage(page + 1);
      }, 1500); // Simulating network delay
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.container}>
      <Video
        source={{ uri: item.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={currentIndex === index}
        isMuted={isMuted}
        isLooping
        onPlaybackStatusUpdate={(status) => setLoading(!status.isLoaded)}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <View style={styles.overlayContainer}>
        <Text style={styles.username}>@{item.username}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleLike(index)}>
            <Icon name="heart" size={30} color="white" style={styles.icon} />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Comments pressed')}>
            <Icon name="comment" size={30} color="white" style={styles.icon} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleShare(index)}>
            <Icon name="share" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute}>
            <Icon name={isMuted ? 'volume-off' : 'volume-up'} size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={reelsData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      horizontal={false}
      showsVerticalScrollIndicator={false}
      ref={flatListRef}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
      onEndReached={loadMoreReels}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#fff" /> : null}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    alignItems: 'flex-end',
  },
  icon: {
    marginBottom: 20,
  },
  actionText: {
    color: 'white',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: height / 2 - 20,
    left: width / 2 - 20,
  },
});
