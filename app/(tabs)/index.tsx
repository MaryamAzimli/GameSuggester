import React, { useState, useEffect } from "react";
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

const HEADER_IMAGE = require("@/assets/defaultProfiles/elf.png");

interface Game {
  appid: string;
  name: string;
  release_date: string;
  required_age: number;
  price: number;
  dlc_count: number;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  reviews: string;
  header_image: string;
  website: string;
  support_url: string;
  support_email: string;
  windows: boolean;
  mac: boolean;
  linux: boolean;
  metacritic_score: number;
  metacritic_url: string;
  achievements: number;
  recommendations: number;
  notes: string;
  supported_languages: string;
  full_audio_languages: string;
  packages: string[];
  developers: string[];
  publishers: string[];
  categories: string[];
  genres: string[];
  screenshots: string[];
  movies: string[];
  positive: number;
  negative: number;
  estimated_owners: number;
  average_playtime_forever: number;
  average_playtime_2weeks: number;
  median_playtime_forever: number;
  median_playtime_2weeks: number;
  peak_ccu: number;
  tags: string[];
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      let url = "http://139.179.208.27:3000/api/games"; // Use your local IP address
      if (Platform.OS === "android") {
        url = "http://139.179.208.27:3000/api/games"; // Use your local IP address
      } else if (Platform.OS === "ios") {
        url = "http://139.179.208.27:3000/api/games"; // Use your local IP address
      } else if (Platform.OS === "web") {
        url = "http://localhost:3000/api/games"; // For Web
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    
    };

    fetchGames();
  }, []);

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
        {games.length > 0 ? (
          games.slice(0, 3).map((game, index) => (
            <View key={index} style={styles.gameCard}>
              <Image source={{ uri: game.header_image }} style={styles.gameImage} />
              <View style={styles.gameInfo}>
                <ThemedText style={styles.gameTitle}>{game.name}</ThemedText>
                <ThemedText style={styles.gameReviews}>
                  Reviews: {game.reviews || "No reviews yet"}
                </ThemedText>
                <ThemedText style={styles.gameDeveloper}>
                  Developer: {game.developers.join(", ")}
                </ThemedText>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noGamesText}>No games available</ThemedText>
        )}
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
  noGamesText: {
    color: "#fff",
    textAlign: "center",
  },
});
