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
        <View style={styles.headerContainer}>
          <Image source={octopusImage} style={styles.profileImage} />
          <ThemedText type="title">Octo the Gamer</ThemedText>
        </View>
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
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "#808080",
    borderWidth: 2,
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
