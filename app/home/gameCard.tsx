import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Text,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Game } from "../(tabs)/types";
import Entypo from "@expo/vector-icons/Entypo";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

{
  /*import LottieView from "lottie-react-native";*/
}

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
  const initialTagColor = "transparent";
  const navigation = useNavigation();

  {
    /*let devAnimation;*/
  }

  {
    /*const handleSuggestSimilar = () => {
    devAnimation.play();
  };*/
  }

  const handleLikeToggle = () => {
    setLiked((prevLiked) => {
      const newLiked = !prevLiked;
      const message = newLiked
        ? `${game.name} is added to your favorites library`
        : `${game.name} is removed from your favorites library`;

      if (Platform.OS === "web") {
        alert(message);
      } else {
        Alert.alert(message);
      }
      return newLiked;
    });
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

  const handleSuggestClick = () => {

    const selectedTags = Object.keys(tagColors).filter(
      (tag) => tagColors[tag] !== initialTagColor
    );


     // Ensure appid is a valid integer
  const appid = parseInt(game.id, 10);

  // Check if appid is a number and greater than zero
  if (isNaN(appid) || appid <= 0) {
    console.error("Invalid appid:", game.appid);
    return;
  }

    const payload = {
      appid: appid,
      tags: selectedTags,
    };

    fetch("https://ep4js2tqr3bhiy3m3xoqyydkim0qrvvg.lambda-url.eu-west-2.on.aws/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors", 
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const appids = data.suggestions.map((item) => item.appid);
        navigation.navigate("home/suggestedGames", { appids });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.innerContainer}>
        {/*<LottieView
          ref={(animation) => {
            devAnimation = animation;
          }}
          source={require("@/assets/animations/suggestSimilar.json")}
          autoPlay={false}
          loop={true}
        />*/}
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
          <View style={styles.detailsContainer}>
            <ThemedText>{game.detailed_description}</ThemedText>
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
        >
          <LinearGradient
            colors={["#8E2DE2", "#4A00E0", "#FF0080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <ThemedText style={styles.suggestButtonText}>
              Suggest Similar
            </ThemedText>
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
});
