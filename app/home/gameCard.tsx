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
            <ThemedText>Developer: {game.developers.join(", ")}</ThemedText>
            <ThemedText>Publisher: {game.publishers.join(", ")}</ThemedText>
            <ThemedText>Release Date: {game.release_date}</ThemedText>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.suggestButton}
          //onPress={handleSuggestSimilar}
        >
          <LinearGradient
            colors={["#8E2DE2", "#4A00E0", "#FF0080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.suggestButtonText}>Suggest Similar</Text>
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
});
