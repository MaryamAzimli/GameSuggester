import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const GameCard = () => {
  const route = useRoute();
  const { game } = route.params;
  const [liked, setLiked] = useState(false);

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
    </ThemedView>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
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
});
