import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import GameContext from "../GameContext";
import { Game } from "./types";
import Constants from 'expo-constants';

const { BASE_URL } = Constants.expoConfig?.extra || {};
console.log('BASE_URL:', BASE_URL);
const HEADER_IMAGE = require("@/assets/defaultProfiles/elf.png");

type RootStackParamList = {
  home: undefined;
  explore: undefined;
  profilePage: undefined;
  "home/gameCard": { game: Game };
};

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, "home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { games, loading } = useContext(GameContext);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const limit = 5;

  useEffect(() => {
    setPage(1); // Reset to first page whenever the query changes
  }, [query]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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
    navigation.navigate("profilePage");
  };

  const handleGamePress = (game: Game) => {
    navigation.navigate("home/gameCard", { game });
  };

  const handleSearch = async () => {
    if (query.trim() === "") return;

    setIsSearching(true);

    try {
      const formattedQuery = query.replace(/[^\w\s]/gi, "");
      const response = await fetch(
        `${BASE_URL}/api/search?q=${formattedQuery}&page=${page}&limit=${limit}`
      );
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response");
      }

      const data = await response.json();
      console.log("Search results:", data); // Log the search results
      setSearchResults(data);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchResults([]); // Reset search results
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
       <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#ccc"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              <Ionicons name="close" size={24} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      {loading || isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.gamesContainer}>
          {(searchResults.length > 0 ? searchResults : games)
            .slice((page - 1) * limit, page * limit)
            .map((game: Game, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
              >
                <Image
                  source={{ uri: game.header_image }}
                  style={styles.gameImage}
                />
                <View style={styles.gameInfo}>
                  <ThemedText
                    style={styles.gameTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {game.name}
                  </ThemedText>
                  <ThemedText
                    style={styles.gameReviews}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    Reviews: {game.reviews || "No reviews yet"}
                  </ThemedText>
                  <ThemedText
                    style={styles.gameDeveloper}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Developer: {game.developers.join(", ")}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          style={[
            styles.paginationButton,
            page === 1 || loading ? styles.disabledButton : null,
          ]}
          disabled={page === 1 || loading}
        >
          <ThemedText style={styles.paginationText}>Previous</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextPage}
          style={[
            styles.paginationButton,
            loading ? styles.disabledButton : null,
          ]}
          disabled={loading}
        >
          <ThemedText style={styles.paginationText}>Next</ThemedText>
        </TouchableOpacity>
      </View>
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
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
  },
  clearButton: {
    marginLeft: 10,
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
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    color: "#fff",
    flexShrink: 1,
  },
  gameReviews: {
    fontSize: 14,
    color: "#888",
    flexShrink: 1,
  },
  gameDeveloper: {
    fontSize: 14,
    color: "#888",
    flexShrink: 1,
  },
  noGamesText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    minHeight: 400,
    marginBottom: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  paginationButton: {
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  paginationText: {
    color: "#fff",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
