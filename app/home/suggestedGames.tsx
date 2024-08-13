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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const SuggestedGamesPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [colorAnimation] = useState(new Animated.Value(0));
  const [games, setGames] = useState<any[]>([]);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

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
    }).start(() => onSwipeComplete());
  };

  const onSwipeComplete = () => {
    setGames((prevGames) => prevGames.slice(1));
    position.setValue({ x: 0, y: 0 });
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
          fetch(`http://139.179.208.27:3000/api/games/${id}`)
            .then((response) => response.json())
            .then((data) => ({
              id: data.id,
              name: data.name,
              image: data.header_image || "/assets/defaultProfiles/default.png", // Placeholder image path
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
            onPress={() =>  navigation.goBack()}
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
            : [styles.card, { top: index * 10, zIndex: games.length - index }];

        return (
          <Animated.View
            key={game.id}
            style={cardStyle}
            {...(index === 0 ? panResponder.panHandlers : {})}
          >
            <Image source={{ uri: game.image }} style={styles.gameImage} />
            <ThemedText style={styles.gameName}>{game.name}</ThemedText>

            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => forceSwipe("left")}>
                <Entypo name="circle-with-cross" size={40} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => forceSwipe("right")}>
                <Entypo name="heart" size={40} color="red" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.cardContainer}>{renderCards()}</View>
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
    backgroundColor: "#FFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gameImage: {
    width: "90%",
    height: "75%",
    borderRadius: 15,
  },
  gameName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 10,
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
});