import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext, useState } from "react";
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

export default function TabTwoScreen() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { games, topReviewedGames, loading } = useContext(GameContext);
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const containerStyle = isMobile
    ? [styles.container, { marginTop: 50 }]
    : styles.container;

  const handleSearch = async () => {
    if (query.trim() === "") return;

    setIsSearching(true);

    try {
      const formattedQuery = query.replace(/[^\w\s]/gi, "");
      const response = await fetch(
        `https://e6aa-94-20-207-112.ngrok-free.app/api/search?q=${formattedQuery}`
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

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
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
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      {loading || isSearching ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScrollView}
        >
          {(searchResults.length > 0 ? searchResults : games)
            .slice(0, 10)
            .map((game: Game, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.gameCard}
                onPress={() => navigation.navigate("home/gameCard", { game })}
              >
                <Image
                  source={{ uri: game.header_image }}
                  style={styles.gameImage}
                />
                <View style={styles.gameInfo}>
                  <ThemedText style={styles.gameTitle}>{game.name}</ThemedText>
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
            ))}
        </ScrollView>
      )}

      <View style={styles.sectionContainer}>
        <ThemedText type="title">Top Reviewed Games</ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.viewAllText}>View all</ThemedText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScrollView}
        >
          {topReviewedGames.length > 0 ? (
            topReviewedGames.slice(0, 5).map((game: Game, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.gameCard}
                onPress={() => navigation.navigate("home/gameCard", { game })}
              >
                <Image
                  source={{ uri: game.header_image }}
                  style={styles.gameImage}
                />
                <View style={styles.gameInfo}>
                  <ThemedText style={styles.gameTitle}>{game.name}</ThemedText>
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
            ))
          ) : (
            <ThemedText style={styles.noGamesText}>
              No games available
            </ThemedText>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  filterButton: {
    marginLeft: 10,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
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
  gameCard: {
    marginRight: 16,
    borderRadius: 10,
    overflow: "hidden",
    width: 200,
    backgroundColor: "#222",
  },
  gameImage: {
    width: "100%",
    height: 120,
  },
  gameInfo: {
    padding: 10,
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
