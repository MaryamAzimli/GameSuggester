import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import LottieView from "lottie-react-native";
import Entypo from "@expo/vector-icons/Entypo";

const screenWidth = Dimensions.get("window").width;
console.log(screenWidth);

const suggestedGamesPage = () => {
  const [colorAnimation] = useState(new Animated.Value(0));

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

  const backgroundColor = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D6589F", "#8576FF"],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View>
        <ThemedText>Suggested Games For You!</ThemedText>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.arrowLeft}>
          <Entypo name="arrow-bold-left" size={30} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrowRight}>
          <Entypo name="arrow-bold-right" size={30} color="blue" />
        </TouchableOpacity>
      </View>
      <View style={styles.gameCard}>
        <Image
          source={{ uri: "https://your-game-image-url.com/image.png" }}
          style={styles.gameImage}
        />
        <ThemedText style={styles.gameName}>Game Name</ThemedText>

        <View style={styles.actions}>
          <TouchableOpacity>
            <Entypo name="circle-with-cross" size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="heart" size={40} color="red" />
          </TouchableOpacity>
        </View>
      </View>
      <LottieView
        source={require("@/assets/animations/rainbow.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
    </Animated.View>
  );
};

export default suggestedGamesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameCard: {
    width: Platform.OS === "web" ? "70%" : "70%",
    height: Platform.OS === "web" ? "60%" : "50%",
    marginTop: screenWidth < 1000 ? 50 : 800,
    marginBottom: 100,
    backgroundColor: "#FFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 20,
  },
  gameImage: {
    width: "90%",
    height: "60%",
    borderRadius: 15,
    marginBottom: 10,
  },
  gameName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  navigation: {
    position: "absolute",
    top: "45%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    zIndex: 10,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    zIndex: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
  },
  lottie: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
  },
});
