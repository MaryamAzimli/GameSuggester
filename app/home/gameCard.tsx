import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";  
import { Game } from "../(tabs)/types";
import Entypo from "@expo/vector-icons/Entypo";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { BASE_URL } = Constants.expoConfig?.extra || {};

type RootStackParamList = {
  home: undefined;
  explore: undefined;
  profilePage: undefined;
  "home/gameCard": { game: Game };
};

type GameCardRouteProp = RouteProp<RootStackParamList, "home/gameCard">;

const GameCard = () => {
  const route = useRoute<GameCardRouteProp>();
  const { game } = route.params;
  const [liked, setLiked] = useState(false);
  const [tagColors, setTagColors] = useState({});
  const [loading, setLoading] = useState(false); // Loading of suggest similar
  const initialTagColor = "transparent";
  const navigation = useNavigation();
  const handleLikeToggle = async () => {
    try {
      console.log('Game object:', game); // Log the game object to verify its contents

      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        Alert.alert('You need to be logged in to like a game.');
        return;
      }
  
      setLiked((prevLiked) => !prevLiked);
  
      const url = liked ? '/removeFavorite' : '/addFavorite';
      const response = await fetch(`${BASE_URL}/api/auth/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ appid: game.id}), // Ensure game.appid is valid
      });
      console.log(game.id);
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update favorites');
      }
  
      const message = liked
        ? `${game.name} is removed from your favorites library`
        : `${game.name} is added to your favorites library`;
      Alert.alert(message);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Failed to update favorites. Please try again.');
    }
    
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
    if (Array.isArray(game.clean_tags) && game.clean_tags.length > 0) {
      setTagColors((prevColors) => ({
        ...prevColors,
        [tag]:
          prevColors[tag] && prevColors[tag] !== initialTagColor
            ? initialTagColor
            : getRandomColor(),
      }));
    }
  };

  const handleSuggestClick = async () => {
    if (loading) return; // Prevent multiple requests

    const selectedTags = Object.keys(tagColors).filter(
      (tag) => tagColors[tag] !== initialTagColor
    );

    const appid = parseInt(game.id, 10);

    if (isNaN(appid) || appid <= 0) {
      console.error("Invalid appid:", game.id);
      return;
    }

    const payload = {
      appid: appid,
      tags: selectedTags,
    };

    setLoading(true); // Start loading

    try {
      const response = await fetch("https://ep4js2tqr3bhiy3m3xoqyydkim0qrvvg.lambda-url.eu-west-2.on.aws/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const appids = data.suggestions.map((item) => item.appid);
      navigation.navigate("home/suggestedGames", { appids });
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to fetch suggestions. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image source={{ uri: game.header_image }} style={styles.gameImage} />
          <View style={styles.titleContainer}>
            <ThemedText type="title">{game.name}</ThemedText>
            <TouchableOpacity onPress={handleLikeToggle} style={styles.icon}>
              <AntDesign
                name={liked ? "heart" : "hearto"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.videoContainer}>
            {game.movies.length > 0 && (
              <Video
                source={{ uri: game.movies[0] }}
                useNativeControls
                resizeMode="contain"
                style={styles.video}
              />
            )}
          </View>
          <View style={styles.detailsContainer}>
            <ThemedText>{game.detailed_description}</ThemedText>
            <ScrollView horizontal style={styles.screenshotsContainer}>
            {game.screenshots.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.screenshot}
              />
            ))}
          </ScrollView>
            <ThemedText>
              <ThemedText style={styles.headText}>Developer: </ThemedText>
              <ThemedText>
                {game.developers?.join(", ") || "Unknown"}
              </ThemedText>
            </ThemedText>

            <ThemedText>
              <ThemedText style={styles.headText}>Release Date: </ThemedText>
              <ThemedText>{game.release_date}</ThemedText>
            </ThemedText>
            <ThemedText>
              <ThemedText style={styles.headText}>Price: </ThemedText>
              <ThemedText>{game.price}$</ThemedText>
            </ThemedText>
            <ThemedText>
              <ThemedText style={styles.headText}>Score: </ThemedText>
              <ThemedText>{game.metacritic_score}</ThemedText>
            </ThemedText>
            <ThemedText>
              <ThemedText style={styles.headText}>User Reviews: </ThemedText>
              <ThemedText>{game.score_rank}</ThemedText>
            </ThemedText>
            <ThemedText style={styles.platContainer}>
              <ThemedText style={styles.headText}>
                Available Platforms
              </ThemedText>

              <ThemedText style={styles.platformText}>
                Windows:{" "}
                {game.windows ? (
                  <Entypo name="check" size={24} color="green" />
                ) : (
                  <Entypo name="cross" size={24} color="red" />
                )}{" "}
              </ThemedText>
              <ThemedText style={styles.platformText}>
                MacOs:{" "}
                {game.mac ? (
                  <Entypo name="check" size={24} color="green" />
                ) : (
                  <Entypo name="cross" size={24} color="red" />
                )}{" "}
              </ThemedText>
              <ThemedText style={styles.platformText}>
                Linux:{" "}
                {game.linux ? (
                  <Entypo name="check" size={24} color="green" />
                ) : (
                  <Entypo name="cross" size={24} color="red" />
                )}
              </ThemedText>
            </ThemedText>

            <ThemedText>
              <ThemedText style={styles.headText}>Tags:</ThemedText>
            </ThemedText>
            <View style={styles.tagsContainer}>
              {Array.isArray(game.clean_tags) ? (
                game.clean_tags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tagButton,
                      {
                        backgroundColor: tagColors[tag] || "transparent",
                        borderColor: "black",
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => handleTagClick(tag)}
                  >
                    <ThemedText>{tag}</ThemedText>
                  </TouchableOpacity>
                ))
              ) : typeof game.clean_tags === "object" ? (
                Object.keys(game.clean_tags).map((key, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tagButton,
                      {
                        backgroundColor: tagColors[key] || "transparent",
                        borderColor: "black",
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => handleTagClick(key)}
                  >
                    <ThemedText>{key}</ThemedText>
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity
                  style={[
                    styles.tagButton,
                    {
                      backgroundColor:
                        tagColors[game.clean_tags] || "transparent",
                      borderColor: "black",
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => handleTagClick(game.clean_tags)}
                >
                  <ThemedText>{game.clean_tags}</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.suggestButton}
          onPress={handleSuggestClick}
          disabled={loading}
        >
          <LinearGradient
            colors={["#8E2DE2", "#4A00E0", "#FF0080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.suggestButtonText}>
                Get Suggestions
              </ThemedText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
  },
  gameImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginLeft: 10,
  },
  icon: {
    marginTop: 5,
    marginLeft: 10,
  },
  detailsContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  detailsText: {
    textAlign: "left",
    marginBottom: 10,
  },
  suggestButton: {
    marginTop: 50,
    borderRadius: 25,
    overflow: "hidden",
    width: "80%",
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: Platform.OS === "web" ? "purple" : "transparent",
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  suggestButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  platContainer: {
    display: "flex",
    gap: 40,
  },
  platformText: {
    display: "flex",
  },
  headText: {
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  tagButton: {
    padding: 5,
    margin: 3,
    borderRadius: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  videoContainer: {
    width: "100%",
    height: 200,
    marginVertical: 20,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  screenshotsContainer: {
    marginVertical: 20,
    maxHeight: 150,
  },
  screenshot: {
    width: 250,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
  },
});
