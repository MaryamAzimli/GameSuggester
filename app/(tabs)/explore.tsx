import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useMediaQuery } from "react-responsive";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import GameContext from "../GameContext";
import { Game } from "./types"; // Import the Game interface

export default function TabTwoScreen() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { games, topReviewedGames } = useContext(GameContext);

  const containerStyle = isMobile
    ? [styles.container, { marginTop: 50 }]
    : styles.container;

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
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ThemedView>

      <View style={styles.sectionContainer}>
        <ThemedText type="title">Top RPG Games</ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.viewAllText}>View all</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScrollView}
      >
        {games.length > 0 ? (
         games.slice(0, 8).map((game: Game, index: number) => (
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
});
