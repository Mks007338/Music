import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { FontAwesome, Ionicons, MaterialIcons, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Demo songs data
const songsData = [
  {
    id: '1',
    title: 'Midnight Waves',
    artist: 'Luna Velvet',
    duration: 237, // in seconds
    coverImage: 'https://api.a0.dev/assets/image?text=midnight%20waves%20album%20cover%20electronic%20music%20abstract%20blue%20waves&aspect=1:1&seed=123',
    album: 'Ocean Dreams',
    year: '2024',
    genre: 'Electronic',
    liked: true,
    lyrics: "Beneath the stars, the ocean calls\nWaves of midnight crashing walls\nSilver light upon the sea\nGuiding you back home to me\n\nMidnight waves, they rise and fall\nLike shadows dancing on the wall\nIn the darkness, find your way\nFollow the moon's guiding ray",
  },
  {
    id: '2',
    title: 'Sunrise Boulevard',
    artist: 'Echo Dreams',
    duration: 195,
    coverImage: 'https://api.a0.dev/assets/image?text=sunrise%20boulevard%20album%20cover%20warm%20orange%20and%20purple%20horizon&aspect=1:1&seed=456',
    album: 'Morning Light',
    year: '2023',
    genre: 'Indie Pop',
    liked: false,
    lyrics: "First light breaking through the clouds\nSilent streets will soon be loud\nMorning dew on city streets\nA brand new day for us to meet\n\nSunrise Boulevard, where dreams begin\nA golden horizon, a chance to win\nThe day is young, the road is clear\nOn Sunrise Boulevard, we persevere",
  },
  {
    id: '3',
    title: 'Neon Heartbeat',
    artist: 'Cyber Symphony',
    duration: 284,
    coverImage: 'https://api.a0.dev/assets/image?text=neon%20heartbeat%20album%20cover%20with%20cyberpunk%20city%20night&aspect=1:1&seed=789',
    album: 'Digital Dreams',
    year: '2024',
    genre: 'Synthwave',
    liked: false,
    lyrics: "Circuits pulsing through the night\nDigital love in neon light\nHeartbeat synced to city's hum\nElectronic pulse, the night has come\n\nNeon signs reflect your face\nIn this cybernetic space\nWe connect beyond the screen\nIn a world that's unforeseen",
  },
  {
    id: '4',
    title: 'Desert Mirage',
    artist: 'Nomad Collective',
    duration: 312,
    coverImage: 'https://api.a0.dev/assets/image?text=desert%20mirage%20album%20cover%20with%20sand%20dunes%20and%20oasis&aspect=1:1&seed=101',
    album: 'Wanderlust',
    year: '2023',
    genre: 'World',
    liked: true,
    lyrics: "Heat waves dancing on the sand\nCaravan across the land\nMirage shimmers in the sun\nOasis where the waters run\n\nDesert winds tell ancient tales\nOf travelers who prevail\nUnder stars and scorching sun\nThe journey's only just begun",
  },
  {
    id: '5',
    title: 'Arctic Whispers',
    artist: 'Frost Melody',
    duration: 256,
    coverImage: 'https://api.a0.dev/assets/image?text=arctic%20whispers%20album%20cover%20with%20snowy%20landscape%20northern%20lights&aspect=1:1&seed=202',
    album: 'Northern Lights',
    year: '2024',
    genre: 'Ambient',
    liked: false,
    lyrics: "Silent snow falls through the air\nNorthern lights dance without care\nIce crystals sparkle and gleam\nIn this arctic winter dream\n\nWhispers carried by the wind\nSecrets that have never been\nIn the silence of the snow\nTruths that only nature knows",
  },
  {
    id: '6',
    title: 'Urban Jungle',
    artist: 'Street Beats',
    duration: 198,
    coverImage: 'https://api.a0.dev/assets/image?text=urban%20jungle%20album%20cover%20with%20city%20skyscrapers%20and%20street%20art&aspect=1:1&seed=303',
    album: 'City Life',
    year: '2023',
    genre: 'Hip Hop',
    liked: true,
    lyrics: "Concrete forest, metal trees\nStreet light stars, urban breeze\nSubway rumble down below\nCity rhythm, constant flow\n\nUrban jungle, wild and free\nSurvival in the city sea\nBetween the cracks where flowers grow\nLife finds a way, don't you know",
  },
];

// Playlists data
const playlistsData = [
  {
    id: '1',
    name: 'Chill Vibes',
    coverImage: 'https://api.a0.dev/assets/image?text=chill%20vibes%20playlist%20relaxing%20lofi%20music&aspect=1:1&seed=1001',
    songIds: ['1', '5', '2'],
    description: 'Relaxing tunes for your downtime'
  },
  {
    id: '2',
    name: 'Workout Mix',
    coverImage: 'https://api.a0.dev/assets/image?text=workout%20mix%20playlist%20energetic%20fitness%20music&aspect=1:1&seed=1002',
    songIds: ['3', '6', '4'],
    description: 'High energy beats to keep you moving'
  },
  {
    id: '3',
    name: 'Focus Time',
    coverImage: 'https://api.a0.dev/assets/image?text=focus%20time%20playlist%20concentration%20work%20music&aspect=1:1&seed=1003',
    songIds: ['5', '1', '2'],
    description: 'Music to help you concentrate'
  }
];

export default function MusicPlayerApp() {
  const [screen, setScreen] = useState('home'); // 'home', 'nowPlaying', 'playlist', 'search', 'library'
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const [volume, setVolume] = useState(0.8);
  const [queue, setQueue] = useState([...songsData]);
  const [showLyrics, setShowLyrics] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const miniPlayerHeight = useRef(new Animated.Value(0)).current;
  const slideUpValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  // Current song
  const currentSong = queue[currentSongIndex];

  useEffect(() => {
    // Initialize liked state whenever song changes
    if (currentSong) {
      setIsLiked(currentSong.liked);
    }
  }, [currentSongIndex, currentSong]);

  // Animation for record spinning
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
      
      // Subtle pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      spinValue.stopAnimation();
      scaleValue.stopAnimation();
    }
  }, [isPlaying]);

  // Effect for screen animations
  useEffect(() => {
    if (screen === 'nowPlaying' || screen === 'playlist' || screen === 'search' || screen === 'library') {
      Animated.parallel([
        Animated.timing(slideUpValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      
      setShowMiniPlayer(false);
    } else {
      slideUpValue.setValue(0);
      opacityValue.setValue(0);
      
      // Show mini player if not on now playing screen
      if (screen === 'home') {
        setShowMiniPlayer(true);
        Animated.timing(miniPlayerHeight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [screen]);

  // Simulate time progress when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= currentSong.duration) {
            handleNext();
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = songsData.filter(
      song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
  }, [searchQuery]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const slideTransform = slideUpValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * queue.length);
      } while (randomIndex === currentSongIndex && queue.length > 1);
      setCurrentSongIndex(randomIndex);
    } else if (repeatMode === 2) {
      // Repeat one - just restart the song
      setCurrentTime(0);
    } else {
      // Normal next or repeat all
      const nextIndex = (currentSongIndex + 1) % queue.length;
      setCurrentSongIndex(nextIndex);
    }
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    if (currentTime > 5) {
      // If past 5 seconds, restart song
      setCurrentTime(0);
    } else {
      // Go to previous song
      const prevIndex = currentSongIndex === 0 ? queue.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
      setCurrentTime(0);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };

  const handleSeek = (value) => {
    setCurrentTime(value);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    
    // Update like status in the queue and original data
    const updatedSongs = [...songsData];
    const songIndex = updatedSongs.findIndex(song => song.id === currentSong.id);
    if (songIndex !== -1) {
      updatedSongs[songIndex] = {
        ...updatedSongs[songIndex],
        liked: !isLiked
      };
    }
    
    // Update queue
    const updatedQueue = [...queue];
    const queueIndex = updatedQueue.findIndex(song => song.id === currentSong.id);
    if (queueIndex !== -1) {
      updatedQueue[queueIndex] = {
        ...updatedQueue[queueIndex],
        liked: !isLiked
      };
      setQueue(updatedQueue);
    }
  };

  const loadPlaylist = (playlist) => {
    if (playlist) {
      const playlistSongs = playlist.songIds.map(
        songId => songsData.find(song => song.id === songId)
      ).filter(Boolean);
      
      setQueue(playlistSongs);
      setCurrentSongIndex(0);
      setCurrentTime(0);
      setSelectedPlaylist(playlist);
      setScreen('nowPlaying');
      setIsPlaying(true);
    }
  };

  const addToQueue = (song) => {
    setQueue(prevQueue => [...prevQueue, song]);
  };

  const playSong = (song, index) => {
    if (index !== undefined) {
      setCurrentSongIndex(index);
    } else {
      // Create a new queue with just this song
      setQueue([song]);
      setCurrentSongIndex(0);
    }
    setCurrentTime(0);
    setIsPlaying(true);
    setScreen('nowPlaying');
  };

  // This handles the swipe down gesture to close the now playing screen
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) { // State.ACTIVE = 4
      if (event.nativeEvent.translationY > 50) {
        // Swiped down enough, close the screen
        setScreen('home');
      } else {
        // Reset position
        Animated.spring(panY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };
  const renderHomeScreen = () => {
    return (
      <ScrollView style={styles.homeContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.homeHeader}>
          <Text style={styles.welcomeText}>Good {getTimeOfDay()}</Text>
          <TouchableOpacity 
            onPress={() => alert("Settings would open here")} 
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recently Played</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recentlyPlayedContainer}
        >
          {songsData.slice(0, 4).map((song, index) => (
            <TouchableOpacity
              key={song.id}
              style={styles.recentlyPlayedItem}
              onPress={() => playSong(song)}
            >
              <Image source={{ uri: song.coverImage }} style={styles.recentlyPlayedCover} />
              <Text style={styles.recentlyPlayedTitle} numberOfLines={1}>{song.title}</Text>
              <Text style={styles.recentlyPlayedArtist} numberOfLines={1}>{song.artist}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Your Playlists</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.playlistsContainer}
        >
          {playlistsData.map((playlist) => (
            <TouchableOpacity
              key={playlist.id}
              style={styles.playlistItem}
              onPress={() => {
                setSelectedPlaylist(playlist);
                setScreen('playlist');
              }}
            >
              <Image source={{ uri: playlist.coverImage }} style={styles.playlistCover} />
              <Text style={styles.playlistTitle} numberOfLines={1}>{playlist.name}</Text>
              <Text style={styles.playlistDescription} numberOfLines={1}>{playlist.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <View style={styles.recommendedContainer}>
          {songsData.map((song, index) => (
            <TouchableOpacity
              key={song.id}
              style={styles.recommendedItem}
              onPress={() => playSong(song)}
            >
              <Image source={{ uri: song.coverImage }} style={styles.recommendedCover} />
              <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedTitle} numberOfLines={1}>{song.title}</Text>
                <Text style={styles.recommendedArtist} numberOfLines={1}>{song.artist}</Text>
              </View>
              <TouchableOpacity
                style={styles.recommendedMoreButton}
                onPress={() => {
                  setCurrentSongIndex(index);
                  setShowAddToPlaylistModal(true);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderNowPlayingScreen = () => {
    return (
      <Animated.View
        style={[
          styles.screenContainer,
          {
            opacity: opacityValue,
            transform: [
              { translateY: Animated.add(slideTransform, panY) }
            ]
          }
        ]}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <View style={styles.dragHandle}>
            <View style={styles.dragHandleBar} />
          </View>
        </PanGestureHandler>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Now Playing</Text>
            {selectedPlaylist && (
              <Text style={styles.headerSubtitle}>From: {selectedPlaylist.name}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={() => setShowAddToPlaylistModal(true)}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          {!showLyrics ? (
            // Album View
            <View style={styles.albumViewContainer}>
              <View style={styles.albumArtContainer}>
                <Animated.View
                  style={[
                    styles.albumInner,
                    {
                      transform: [{ rotate: spin }, { scale: scaleValue }],
                    },
                  ]}
                >
                  <Image
                    source={{ uri: currentSong.coverImage }}
                    style={styles.albumArt}
                  />
                </Animated.View>
                <View style={styles.albumCenter} />
              </View>

              <View style={styles.songInfoContainer}>
                <Text style={styles.songTitle}>{currentSong.title}</Text>
                <Text style={styles.artistName}>{currentSong.artist}</Text>
                <Text style={styles.albumInfo}>{currentSong.album} • {currentSong.year}</Text>
              </View>
            </View>
          ) : (
            // Lyrics View
            <ScrollView style={styles.lyricsContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.lyricsTitle}>{currentSong.title} - Lyrics</Text>
              <Text style={styles.lyricsText}>{currentSong.lyrics}</Text>
            </ScrollView>
          )}

          <View style={styles.progressContainer}>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={currentSong.duration}
              value={currentTime}
              onValueChange={handleSeek}
              minimumTrackTintColor="#E872FA"
              maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
              thumbTintColor="#FF72FA"
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(currentSong.duration)}</Text>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, isShuffle && styles.activeControl]}
              onPress={toggleShuffle}
            >
              <MaterialIcons
                name="shuffle"
                size={24}
                color={isShuffle ? "#E872FA" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}>
              <FontAwesome name="step-backward" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <LinearGradient
                colors={['#E872FA', '#B630FF']}
                style={styles.playButtonGradient}
              >
                <FontAwesome
                  name={isPlaying ? "pause" : "play"}
                  size={28}
                  color="white"
                  style={isPlaying ? {} : { marginLeft: 4 }}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
              <FontAwesome name="step-forward" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, repeatMode > 0 && styles.activeControl]}
              onPress={toggleRepeat}
            >
              <MaterialIcons
                name={repeatMode === 2 ? "repeat-one" : "repeat"}
                size={24}
                color={repeatMode > 0 ? "#E872FA" : "white"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.secondaryControlsContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowVolumeModal(true)}>
              <Ionicons name={getVolumeIcon()} size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={toggleLike}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={isLiked ? "#E872FA" : "white"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowLyrics(!showLyrics)}>
              <MaterialCommunityIcons 
                name="music-note-text" 
                size={24} 
                color={showLyrics ? "#E872FA" : "white"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => alert(`Sharing: ${currentSong.title} by ${currentSong.artist}`)}
            >
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPlaylistScreen = () => {
    if (!selectedPlaylist) return null;
    
    const playlistSongs = selectedPlaylist.songIds
      .map(songId => songsData.find(song => song.id === songId))
      .filter(Boolean);
      
    return (
      <Animated.View
        style={[
          styles.screenContainer,
          {
            opacity: opacityValue,
            transform: [{ translateY: slideTransform }]
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playlist</Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => alert("Playlist options would open here")}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.playlistHeaderContainer}>
          <Image 
            source={{ uri: selectedPlaylist.coverImage }} 
            style={styles.playlistDetailCover} 
          />
          <View style={styles.playlistDetailInfo}>
            <Text style={styles.playlistDetailName}>{selectedPlaylist.name}</Text>
            <Text style={styles.playlistDetailDesc}>{selectedPlaylist.description}</Text>
            <Text style={styles.playlistDetailSongs}>{playlistSongs.length} songs</Text>
            
            <View style={styles.playlistActionButtons}>
              <TouchableOpacity 
                style={styles.playlistPlayButton}
                onPress={() => loadPlaylist(selectedPlaylist)}
              >
                <LinearGradient
                  colors={['#E872FA', '#B630FF']}
                  style={styles.playlistPlayButtonGradient}
                >
                  <Ionicons name="play" size={24} color="white" style={{marginLeft: 2}} />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.playlistShuffleButton}
                onPress={() => {
                  if (playlistSongs.length > 0) {
                    setQueue([...playlistSongs]);
                    setIsShuffle(true);
                    setCurrentSongIndex(Math.floor(Math.random() * playlistSongs.length));
                    setCurrentTime(0);
                    setScreen('nowPlaying');
                    setIsPlaying(true);
                  }
                }}
              >
                <Ionicons name="shuffle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <FlatList
          data={playlistSongs}
          keyExtractor={(item) => item.id}
          style={styles.playlistSongsList}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.playlistSongItem}
              onPress={() => {
                loadPlaylist(selectedPlaylist);
                setCurrentSongIndex(index);
              }}
            >
              <Image source={{ uri: item.coverImage }} style={styles.playlistSongCover} />
              <View style={styles.playlistSongInfo}>
                <Text style={styles.playlistSongTitle}>{item.title}</Text>
                <Text style={styles.playlistSongArtist}>{item.artist}</Text>
              </View>
              <TouchableOpacity 
                style={styles.playlistSongMore}
                onPress={() => {
                  setCurrentSongIndex(index);
                  setShowAddToPlaylistModal(true);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    );
  };

  const renderSearchScreen = () => {
    return (
      <Animated.View
        style={[
          styles.screenContainer,
          {
            opacity: opacityValue,
            transform: [{ translateY: slideTransform }]
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists, albums..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </View>
        
        {searchQuery.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={50} color="rgba(255,255,255,0.3)" />
                <Text style={styles.noResultsText}>No results found</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchResultItem}
                onPress={() => playSong(item)}
              >
                <Image source={{ uri: item.coverImage }} style={styles.searchResultCover} />
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultTitle}>{item.title}</Text>
                  <Text style={styles.searchResultArtist}>
                    {item.artist} • {item.album}
                  </Text>
                </View>
              <TouchableOpacity 
                style={styles.searchResultMore}
                onPress={() => {
                  const index = queue.findIndex(song => song.id === item.id);
                  setCurrentSongIndex(index >= 0 ? index : 0);
                  setShowAddToPlaylistModal(true);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.searchSuggestionsContainer}>
            <Text style={styles.searchCategoryTitle}>Browse Categories</Text>
            <View style={styles.searchCategories}>
              {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'R&B', 'Classical', 'Jazz', 'Indie'].map((category) => (
                <TouchableOpacity 
                  key={category} 
                  style={styles.categoryButton}
                  onPress={() => setSearchQuery(category)}
                >
                  <Text style={styles.categoryButtonText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  const renderLibraryScreen = () => {
    return (
      <Animated.View
        style={[
          styles.screenContainer,
          {
            opacity: opacityValue,
            transform: [{ translateY: slideTransform }]
          }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
            <Ionicons name="chevron-down" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Library</Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => alert("Playlist options would open here")}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.libraryTabsContainer}>
          {['Playlists', 'Artists', 'Albums', 'Songs'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.libraryTab, styles.activeLibraryTab]}
            >
              <Text style={[styles.libraryTabText, styles.activeLibraryTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.likedSongsContainer}>
          <LinearGradient
            colors={['#B630FF', '#E872FA']}
            style={styles.likedSongsBanner}
          >
            <View style={styles.likedSongsContent}>
              <View>
                <Text style={styles.likedSongsTitle}>Liked Songs</Text>
                <Text style={styles.likedSongsCount}>
                  {songsData.filter(song => song.liked).length} songs
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.likedSongsPlayButton}
                onPress={() => {
                  const likedSongs = songsData.filter(song => song.liked);
                  if (likedSongs.length > 0) {
                    setQueue(likedSongs);
                    setCurrentSongIndex(0);
                    setCurrentTime(0);
                    setScreen('nowPlaying');
                    setIsPlaying(true);
                  } else {
                    alert("No liked songs to play");
                  }
                }}
              >
                <Ionicons name="play" size={24} color="#B630FF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        
        <Text style={styles.librarySubtitle}>Your Playlists</Text>
        
        <FlatList
          data={playlistsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.libraryPlaylistItem}
              onPress={() => {
                setSelectedPlaylist(item);
                setScreen('playlist');
              }}
            >
              <Image source={{ uri: item.coverImage }} style={styles.libraryPlaylistCover} />
              <View style={styles.libraryPlaylistInfo}>
                <Text style={styles.libraryPlaylistName}>{item.name}</Text>
                <Text style={styles.libraryPlaylistDesc}>{item.description}</Text>
              </View>
              <TouchableOpacity 
                style={styles.libraryPlaylistMore}
                onPress={() => alert(`Options for "${item.name}" playlist`)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    );
  };

  const renderMiniPlayer = () => {
    if (!showMiniPlayer || !currentSong) return null;
    
    return (
      <Animated.View 
        style={[
          styles.miniPlayerContainer,
          {
            height: miniPlayerHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 60]
            })
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.miniPlayerContent}
          onPress={() => setScreen('nowPlaying')}
        >
          <Image source={{ uri: currentSong.coverImage }} style={styles.miniPlayerCover} />
          <View style={styles.miniPlayerInfo}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentSong.title}</Text>
            <Text style={styles.miniPlayerArtist} numberOfLines={1}>{currentSong.artist}</Text>
          </View>
          <TouchableOpacity style={styles.miniPlayerButton} onPress={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.miniProgressBar}>
          <View 
            style={[
              styles.miniProgressFill, 
              { width: `${(currentTime / currentSong.duration) * 100}%` }
            ]} 
          />
        </View>
      </Animated.View>
    );
  };

  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setScreen('home')}
        >
          <Ionicons 
            name={screen === 'home' ? "home" : "home-outline"} 
            size={24} 
            color={screen === 'home' ? "#E872FA" : "white"} 
          />
          <Text style={[styles.tabLabel, screen === 'home' && styles.activeTabLabel]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => {
            setSearchQuery('');
            setScreen('search');
          }}
        >
          <Ionicons 
            name={screen === 'search' ? "search" : "search-outline"} 
            size={24} 
            color={screen === 'search' ? "#E872FA" : "white"} 
          />
          <Text style={[styles.tabLabel, screen === 'search' && styles.activeTabLabel]}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setScreen('library')}
        >
          <Ionicons 
            name={screen === 'library' ? "library" : "library-outline"} 
            size={24} 
            color={screen === 'library' ? "#E872FA" : "white"} 
          />
          <Text style={[styles.tabLabel, screen === 'library' && styles.activeTabLabel]}>Library</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Volume Modal
  const renderVolumeModal = () => {
    return (
      <Modal
        visible={showVolumeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVolumeModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVolumeModal(false)}
        >
          <View style={styles.volumeModalContainer}>
            <Text style={styles.volumeModalTitle}>Volume</Text>
            <View style={styles.volumeControlsContainer}>
              <Ionicons name="volume-low" size={24} color="white" />
              <Slider
                style={styles.volumeModalSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor="#E872FA"
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbTintColor="#FF72FA"
              />
              <Ionicons name="volume-high" size={24} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  // Add to Playlist Modal
  const renderAddToPlaylistModal = () => {
    return (
      <Modal
        visible={showAddToPlaylistModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddToPlaylistModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.playlistModalContainer}>
            <View style={styles.playlistModalHeader}>
              <Text style={styles.playlistModalTitle}>Song Options</Text>
              <TouchableOpacity onPress={() => setShowAddToPlaylistModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.songActionsList}>
              <TouchableOpacity 
                style={styles.songActionItem}
                onPress={() => {
                  alert(`"${currentSong.title}" would be added to a playlist`);
                  setShowAddToPlaylistModal(false);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="white" />
                <Text style={styles.songActionText}>Add to Playlist</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.songActionItem}
                onPress={() => {
                  setIsLiked(!isLiked);
                  setShowAddToPlaylistModal(false);
                }}
              >
                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color="white" />
                <Text style={styles.songActionText}>
                  {isLiked ? "Remove from Liked Songs" : "Add to Liked Songs"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.songActionItem}
                onPress={() => {
                  alert(`Viewing artist: ${currentSong.artist}`);
                  setShowAddToPlaylistModal(false);
                }}
              >
                <Ionicons name="person-outline" size={24} color="white" />
                <Text style={styles.songActionText}>View Artist</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.songActionItem}
                onPress={() => {
                  alert(`Viewing album: ${currentSong.album}`);
                  setShowAddToPlaylistModal(false);
                }}
              >
                <Ionicons name="disc-outline" size={24} color="white" />
                <Text style={styles.songActionText}>View Album</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.songActionItem}
                onPress={() => {
                  alert(`Sharing: ${currentSong.title} by ${currentSong.artist}`);
                  setShowAddToPlaylistModal(false);
                }}
              >
                <Ionicons name="share-outline" size={24} color="white" />
                <Text style={styles.songActionText}>Share</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.songDetailsSection}>
              <Image source={{ uri: currentSong.coverImage }} style={styles.songDetailsImage} />
              <View style={styles.songDetailsInfo}>
                <Text style={styles.songDetailsTitle}>{currentSong.title}</Text>
                <Text style={styles.songDetailsArtist}>{currentSong.artist}</Text>
                <Text style={styles.songDetailsAlbum}>{currentSong.album} • {currentSong.year}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Helper functions
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  const getVolumeIcon = () => {
    if (volume === 0) return "volume-mute";
    if (volume < 0.4) return "volume-low";
    if (volume < 0.7) return "volume-medium";
    return "volume-high";
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#1E2140', '#2A3166', '#1E2140']}
          style={styles.container}
        >
          {/* Main content based on current screen */}
          {screen === 'home' && renderHomeScreen()}
          {screen === 'nowPlaying' && renderNowPlayingScreen()}
          {screen === 'playlist' && renderPlaylistScreen()}
          {screen === 'search' && renderSearchScreen()}
          {screen === 'library' && renderLibraryScreen()}
          
          {/* Mini player */}
          {renderMiniPlayer()}
          
          {/* Tab bar (except on now playing screen) */}
          {screen !== 'nowPlaying' && renderTabBar()}
          
          {/* Modals */}
          {renderVolumeModal()}
          {renderAddToPlaylistModal()}
        </LinearGradient>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E2140',
    zIndex: 10,
  },
  // Home Screen
  homeContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Space for tab bar
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10,
  },
  recentlyPlayedContainer: {
    marginBottom: 24,
  },
  recentlyPlayedItem: {
    width: 140,
    marginRight: 16,
  },
  recentlyPlayedCover: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentlyPlayedTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  recentlyPlayedArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  playlistsContainer: {
    marginBottom: 24,
  },
  playlistItem: {
    width: 160,
    marginRight: 16,
  },
  playlistCover: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  playlistDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  recommendedContainer: {
    marginBottom: 20,
  },
  recommendedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  recommendedCover: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  recommendedArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  recommendedMoreButton: {
    padding: 8,
  },
  // Now Playing Screen
  dragHandle: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  albumViewContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  albumArtContainer: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  albumInner: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    overflow: 'hidden',
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
  },
  albumCenter: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E2140',
    zIndex: 10,
  },
  songInfoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  songTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  artistName: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  albumInfo: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
  lyricsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  lyricsTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  lyricsText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginVertical: 10,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -10,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  controlButton: {
    padding: 10,
  },
  activeControl: {
    opacity: 1,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  playButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  secondaryButton: {
    padding: 10,
  },
  // Playlist Screen
  playlistHeaderContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  playlistDetailCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  playlistDetailInfo: {
    flex: 1,
  },
  playlistDetailName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playlistDetailDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  playlistDetailSongs: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 12,
  },
  playlistActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistPlayButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  playlistPlayButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistShuffleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistSongsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  playlistSongItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  playlistSongCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  playlistSongInfo: {
    flex: 1,
  },
  playlistSongTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  playlistSongArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  playlistSongMore: {
    padding: 8,
  },
  // Search Screen
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 12,
    fontSize: 16,
  },
  searchSuggestionsContainer: {
    flex: 1,
    padding: 16,
  },
  searchCategoryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 6,
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  searchResultCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  searchResultMore: {
    padding: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    marginTop: 10,
  },
  // Library Screen
  libraryTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  libraryTab: {
    marginRight: 16,
    paddingBottom: 4,
  },
  activeLibraryTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E872FA',
  },
  libraryTabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  activeLibraryTabText: {
    color: 'white',
    fontWeight: '500',
  },
  likedSongsContainer: {
    padding: 16,
  },
  likedSongsBanner: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  likedSongsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  likedSongsTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  likedSongsCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  likedSongsPlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  librarySubtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 12,
  },
  libraryPlaylistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  libraryPlaylistCover: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  libraryPlaylistInfo: {
    flex: 1,
  },
  libraryPlaylistName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  libraryPlaylistDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  libraryPlaylistMore: {
    padding: 8,
  },
  // Mini Player
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 60, // Above tab bar
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 33, 64, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  miniPlayerCover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
  },
  miniPlayerTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  miniPlayerArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  miniPlayerButton: {
    padding: 8,
  },
  miniProgressBar: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    bottom: 0,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#E872FA',
  },
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#151731',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#E872FA',
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeModalContainer: {
    width: '80%',
    backgroundColor: '#2A3166',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  volumeModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  volumeControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  volumeModalSlider: {
    flex: 1,
    marginHorizontal: 10,
    height: 40,
  },
  playlistModalContainer: {
    width: '100%',
    backgroundColor: '#2A3166',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    maxHeight: height * 0.7,
  },
  playlistModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  playlistModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  songActionsList: {
    marginBottom: 20,
  },
  songActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  songActionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  songDetailsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 12,
  },
  songDetailsImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  songDetailsInfo: {
    flex: 1,
  },
  songDetailsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  songDetailsArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 2,
  },
  songDetailsAlbum: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});