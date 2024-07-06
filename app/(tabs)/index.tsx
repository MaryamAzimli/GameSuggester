import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import gameImage from "@/assets/defaultProfiles/elf.png";

const HEADER_IMAGE = require("@/assets/defaultProfiles/elf.png");

export default function HomeScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleBellPress = () => {
    setNotificationsEnabled(!notificationsEnabled);
    const message = notificationsEnabled
      ? "Notifications have been disabled"
      : "Notifications have been enabled";

    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("Notifications", message);
    }
  };

  const handleSettingsPress = () => {
    navigation.navigate("profile/settings");
  };

  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Image source={HEADER_IMAGE} style={styles.headerImage} />
          <View style={styles.headerIconsContainer}>
            <TouchableOpacity onPress={handleBellPress} style={styles.iconLeft}>
              <Ionicons
                name={
                  notificationsEnabled
                    ? "notifications"
                    : "notifications-off-sharp"
                }
                size={24}
                color="white"
                style={styles.bellIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSettingsPress}
              style={styles.iconRight}
            >
              <Feather
                name="settings"
                size={24}
                color="white"
                style={styles.settingsIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      }
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    >
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#ccc"
        />
      </ThemedView>
      <ScrollView contentContainerStyle={styles.gamesContainer}>
        {[...Array(3)].map((_, index) => (
          <View key={index} style={styles.gameCard}>
            <Image source={gameImage} style={styles.gameImage} />
            <View style={styles.gameInfo}>
              <ThemedText style={styles.gameTitle}>Game Pro Title</ThemedText>
              <ThemedText style={styles.gameReviews}>
                Reviews: Very Positive
              </ThemedText>
              <ThemedText style={styles.gameDeveloper}>Developer</ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerImageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerIconsContainer: {
    position: "absolute",
    top: Platform.OS === "web" ? 10 : 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
  },
  iconLeft: {
    padding: 10,
  },
  iconRight: {
    padding: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
  },
  gamesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  gameCard: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
  gameImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  gameInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  gameTitle: {
    fontSize: 18,
    color: "#fff",
  },
  gameReviews: {
    fontSize: 14,
    color: "#888",
  },
  gameDeveloper: {
    fontSize: 14,
    color: "#888",
  },
});
