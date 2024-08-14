import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext, useState } from "react";
import { Platform } from "react-native";
import {
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useMediaQuery } from "react-responsive";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import GameContext from "../GameContext";
import { Game } from "./types"; // Import the Game interface
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from 'expo-constants';

const { BASE_URL } = Constants.expoConfig?.extra || {};
console.log('BASE_URL:', BASE_URL);

export default function TabTwoScreen() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { games, filteredGames, topGames, loading, addTag, removeTag, selectedTags } = useContext(GameContext);
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 200);
  const [isTagContainerVisible, setIsTagContainerVisible] = useState(false);
  const [tagColors, setTagColors] = useState({});
  const [backgroundGradient, setBackgroundGradient] = useState([
    "#000",
    "#000",
  ]);

  const containerStyle = isMobile
    ? [styles.container, { marginTop: 50 }]
    : [styles.container];

  const handleSearch = async () => {
    if (query.trim() === "") return;

    setIsSearching(true);

    try {
      const formattedQuery = query.replace(/[^\w\s]/gi, "");
      const response = await fetch(
        `${BASE_URL}/api/search?q=${formattedQuery}`
      );
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response");
      }

      const data = await response.json();
      console.log("Search results:", data);
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

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const toggleTagContainer = () => {
    setIsTagContainerVisible(!isTagContainerVisible);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      removeTag(tag);
    } else {
      addTag(tag);
    }

    setTagColors((prevColors) => {
      const newColors = { ...prevColors };
      if (newColors[tag]) {
        delete newColors[tag];
      } else {
        const randomColor = getRandomColor();
        newColors[tag] = randomColor;
      }
      const selectedColors = Object.values(newColors);
      if (selectedColors.length === 1) {
        setBackgroundGradient([selectedColors[0], selectedColors[0]]);
      } else if (selectedColors.length > 1) {
        setBackgroundGradient([
          selectedColors[selectedColors.length - 1],
          ...selectedColors.slice(0, -1),
        ]);
      } else {
        setBackgroundGradient(["#000", "#000"]);
      }
      return newColors;
    });
  };

  return (
    <ScrollView style={containerStyle}>
      <ThemedView>
        <ThemedText></ThemedText>
      </ThemedView>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">All Games</ThemedText>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={24}
            color="#ccc"
            style={styles.searchIcon}
          />
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
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleTagContainer}
          >
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {isTagContainerVisible && (
          <View style={styles.tagContainer}>
            {["Shooter","Adventure","RPG","Battle Royale","Strategy","Sports","Puzzle","Casual","Indie","MOBA","Horror","Simulation","Fighting","Character Customization"].map(
              (tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tagButton,
                    { backgroundColor: tagColors[tag] || "#444" },
                  ]}
                  onPress={() => handleTagClick(tag)}
                >
                  <ThemedText>{tag}</ThemedText>
                </TouchableOpacity>
              )
            )}
          </View>
        )}
      </ThemedView>

      {loading || isSearching ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : isMobile || Platform.OS === "ios" || Platform.OS === "android" ? (
        <ScrollView>
          <LinearGradient
            colors={backgroundGradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.linearGradient}
          >
            {(searchResults.length > 0 ? searchResults : filteredGames).map(
              (game: Game, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.mobileGameCard}
                  onPress={() => navigation.navigate("home/gameCard", { game })}
                >
                  <Image
                    source={{ uri: game.header_image }}
                    style={styles.mobileGameImage}
                  />
                  <View style={styles.mobileGameInfo}>
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
                      Reviews:{" "}
                      {truncateText(game.reviews || "No reviews yet", 100)}
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
              )
            )}
          </LinearGradient>
        </ScrollView>
      ) : (
        <LinearGradient
          colors={backgroundGradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.linearGradient}
        >
          <View style={styles.gamesContainer}>
            {(searchResults.length > 0 ? searchResults : filteredGames).map(
              (game: Game, index: number) => (
                <View
                  key={index}
                  style={[styles.gameCard, { width: `${100 / numColumns}%` }]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("home/gameCard", { game })
                    }
                  >
                    <Image
                      source={{ uri: game.header_image }}
                      style={styles.gameImage}
                    />
                    <View style={styles.gameInfo}>
                      <ThemedText style={styles.gameTitle}>
                        {game.name}
                      </ThemedText>
                      <ThemedText style={styles.gameReviews}>
                        Reviews:{" "}
                        {truncateText(game.reviews || "No reviews yet", 100)}
                        <ThemedText style={styles.readMoreText}>
                          {" "}
                          Read More...
                        </ThemedText>
                      </ThemedText>
                      <ThemedText style={styles.gameDeveloper}>
                        Developer: {game.developers.join(", ")}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        </LinearGradient>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  gamesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
  },
  gameCard: {
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  mobileGameCard: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerContainer: {
    padding: 16,
    paddingTop: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  clearButton: {
    padding: 10,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  tagButton: {
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  viewAllText: {
    color: "#FFA500",
  },
  horizontalScrollView: {
    paddingLeft: 16,
  },
  gameImage: {
    width: "100%",
    height: 120,
  },
  mobileGameImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  gameInfo: {
    padding: 10,
  },
  mobileGameInfo: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1,
  },
  gameTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  gameReviews: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  gameDeveloper: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  noGamesText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  readMoreText: {
    color: "#87C4FF",
  },
});