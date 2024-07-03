import React, { useState } from "react";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import octopusImage from "@/assets/images/octopus.png";
import { FontAwesome } from "@expo/vector-icons";

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState("Games");

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
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Games" && styles.selectedTab]}
          onPress={() => setSelectedTab("Games")}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === "Games" && styles.selectedTabText,
            ]}
          >
            Games
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Lists" && styles.selectedTab]}
          onPress={() => setSelectedTab("Lists")}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === "Lists" && styles.selectedTabText,
            ]}
          >
            Lists
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Plus" && styles.selectedTab]}
          onPress={() => setSelectedTab("Plus")}
        >
          <FontAwesome
            name="plus"
            size={24}
            color={selectedTab === "Plus" ? "#FFA500" : "white"}
          />
        </TouchableOpacity>
      </ThemedView>
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  selectedTab: {
    borderColor: "#FFA500",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  selectedTabText: {
    color: "#FFA500",
  },
});
