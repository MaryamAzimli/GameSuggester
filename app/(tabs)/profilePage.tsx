import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StyleSheet, Image, Platform } from "react-native";
import React from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const profilePage = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <FontAwesome5 size={310} name="user-alt" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile Page</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default profilePage;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -80,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
