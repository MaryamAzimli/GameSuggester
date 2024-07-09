import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SimpleLineIcons } from "@expo/vector-icons";
import mage from "@/assets/defaultProfiles/mage.png";

const followersData = [
  { id: "1", name: "John Doe", image: mage, isLocal: true },
  {
    id: "2",
    name: "Jane Smith",
    image: "https://ex/50",
    isLocal: false,
  },
];

const FollowerCard = ({ follower }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <View style={styles.followerCard}>
      <Image
        source={follower.isLocal ? follower.image : { uri: follower.image }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{follower.name}</Text>
      <TouchableOpacity onPress={toggleFollow} style={styles.followButton}>
        <SimpleLineIcons
          name={isFollowing ? "user-following" : "user-follow"}
          size={30}
          color={isFollowing ? "green" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

const Followers = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Followers
      </ThemedText>
      <FlatList
        data={followersData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FollowerCard follower={item} />}
      />
    </ThemedView>
  );
};

export default Followers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ffffff",
    alignSelf: "center",
  },
  followerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    color: "#ffffff",
    flex: 1,
  },
  followButton: {
    padding: 10,
  },
});
