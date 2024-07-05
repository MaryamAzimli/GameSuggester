import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const Followers = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Followers</ThemedText>
    </ThemedView>
  );
};

export default Followers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
