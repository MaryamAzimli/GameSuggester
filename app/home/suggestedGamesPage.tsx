import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const suggestedGamesPage = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>
    </ThemedView>
  );
};

export default suggestedGamesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
