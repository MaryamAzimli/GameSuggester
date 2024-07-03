import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StyleSheet, Image, Platform } from "react-native";
import React from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import octopusImage from "@/assets/images/octopus.png";

const ProfilePage = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <Image source={octopusImage} style={styles.profileImage} />
          <ThemedText type="title">Octo the Gamer</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>87.8K</ThemedText>
              <ThemedText style={styles.statLabel}>Followers</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>526</ThemedText>
              <ThemedText style={styles.statLabel}>Following</ThemedText>
            </View>
          </View>
        </ThemedView>
      }
    >
      <ThemedView style={styles.titleContainer}></ThemedView>
    </ParallaxScrollView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 310,
    backgroundColor: "#353636",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    borderColor: "#808080",
    borderWidth: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFA500",
  },
  statLabel: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  titleText: {
    textAlign: "center",
  },
});
