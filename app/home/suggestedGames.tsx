import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Text,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import LottieView from "lottie-react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from 'expo-constants';
import { Video } from "expo-av";  

const { BASE_URL } = Constants.expoConfig?.extra || {};
console.log('BASE_URL:', BASE_URL);
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SuggestedGamesPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [colorAnimation] = useState(new Animated.Value(0));
  const [games, setGames] = useState<any[]>([]);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayContent, setOverlayContent] = useState({ color: "", icon: "" });
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [showDetails, setShowDetails] = useState(false);

  const triggerOverlay = (icon, color) => {
    setOverlayContent({ icon, color });

    Animated.sequence([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      })
    ]).start();
};

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 120) {
            forceSwipe("right");
        } else if (gestureState.dx < -120) {
            forceSwipe("left");
        } else {
            resetPosition();
        }
    },
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === "right" ? screenWidth : -screenWidth;
    
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
};

  const onSwipeComplete = (direction) => {
    const icon = direction === "right" ? "heart" : "circle-with-cross";
    const color = direction === "right" ? "rgba(255,0,0,0.8)" : "rgba(0,0,0,0.8)";
    
    triggerOverlay(icon, color);
  
    setTimeout(() => {
      setGames((prevGames) => prevGames.slice(1));
      position.setValue({ x: 0, y: 0 });
    }, 1000);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-screenWidth * 1.5, 0, screenWidth * 1.5],
      outputRange: ["-30deg", "0deg", "30deg"],
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate },
      ],
    };
  };

  const renderOverlay = () => {
    return (
      <Animated.View pointerEvents="none" style={[styles.overlay, { backgroundColor: overlayContent.color, opacity: overlayOpacity }]}>
        <Entypo name={overlayContent.icon} size={100} color="#FFF" />
      </Animated.View>
    );
};

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(colorAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(colorAnimation, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [colorAnimation]);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const appids = route.params?.appids || [];
        const gamePromises = appids.map((id) =>
          fetch(`${BASE_URL}/api/games/${id}`)
            .then((response) => response.json())
            .then((data) => ({
              id: data.id,
              name: data.name,
              image: data.header_image || "/assets/defaultProfiles/default.png",
              movies: data.movies,
            }))
        );
        const fetchedGames = await Promise.all(gamePromises);
        setGames(fetchedGames);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    };

    fetchGameData();
  }, [route.params?.appids]);

  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D6589F", "#8576FF"],
  });

  const renderCards = () => {
    if (games.length === 0) {
      return (
        <View style={styles.noMoreCards}>
          <ThemedText style={styles.noMoreText}>
            No more suggested games.
          </ThemedText>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <ThemedText style={styles.goBackText}>Go Back!</ThemedText>
          </TouchableOpacity>
        </View>
      );
    }
  
    return games
      .map((game, index) => {
        const cardStyle =
          index === 0
            ? [
                getCardStyle(),
                styles.card,
                { zIndex: games.length - index, top: -3 },
              ]
            : [styles.card, { top: index, zIndex: games.length - index }];
  
        return (
          <Animated.View
            key={game.id}
            style={cardStyle}
            {...(index === 0 ? panResponder.panHandlers : {})}
          >
            {!showDetails && (
              <>
                <Image source={{ uri: game.image }} style={styles.gameImage} />
                <ThemedText style={styles.gameName}>{game.name}</ThemedText>
              </>
            )}

            {showDetails && (
              <>
                <ThemedText style={styles.gameDescription}>
                  Detailed information about {game.name}.
                </ThemedText>
              </>
            )}

            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => setShowDetails(!showDetails)}
            >
              <ThemedText style={styles.detailButtonText}>
                {showDetails ? "Go Back" : "Show Details"}
              </ThemedText>
            </TouchableOpacity>
  
            {!showDetails && (
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => forceSwipe("left")}>
                  <Entypo name="circle-with-cross" size={40} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => forceSwipe("right")}>
                  <Entypo name="heart" size={40} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.cardContainer}>{renderCards()}</View>
      {renderOverlay()}
      <View style={styles.lottieContainer}>
        <LottieView
          source={require("@/assets/animations/rainbow.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </Animated.View>
  );
};

export default SuggestedGamesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    position: "relative",
    zIndex: 1,
  },
  card: {
    position: "absolute",
    width: screenWidth * 0.8,
    height: screenHeight * 0.6,
    borderRadius: 25, 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
    backgroundColor: "#FFF",
    padding: 20, 
  },
  gameImage: {
    width: "100%",
    height: "40%",
    borderRadius: 15,
    marginBottom: 100,
    overlayColor: "rgba(0,0,0,0.3)", 
  },
  gameName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "black",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: 10,
    paddingVertical: 10, 
    borderRadius: 10,  
  },
  lottieContainer: {
    position: "absolute",
    top: Platform.OS === "web" ? "70%" : "45%",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  lottie: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  noMoreCards: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
  },
  noMoreText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  goBackText: {
    fontSize: 20,
    color: "#000",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  detailButton: {
    marginTop: 20,
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  
  detailButtonText: {
    fontSize: 20,
    color: "#000",
  },
  
  gameDescription: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginTop: 10,
  },
});