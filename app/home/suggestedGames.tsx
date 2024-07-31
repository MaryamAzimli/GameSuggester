import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import LottieView from "lottie-react-native";

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
      <ThemedText type="title">Card</ThemedText>
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
  animation: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
