import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Text,
  Button,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Feather } from "@expo/vector-icons";
import { useMediaQuery } from "react-responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import alien from "@/assets/defaultProfiles/alien.png";
import astronout from "@/assets/defaultProfiles/astronout.png";
import criminal from "@/assets/defaultProfiles/criminal.png";
import elf from "@/assets/defaultProfiles/elf.png";
import gamerGirl from "@/assets/defaultProfiles/gamerGirl.png";
import guyRegular from "@/assets/defaultProfiles/guyRegular.png";
import mage from "@/assets/defaultProfiles/mage.png";
import monster from "@/assets/defaultProfiles/monster.png";
import ninja from "@/assets/defaultProfiles/ninja.png";
import pirate from "@/assets/defaultProfiles/pirate.png";
import superHero from "@/assets/defaultProfiles/superHero.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { BASE_URL } = Constants.expoConfig?.extra || {};
import Constants from 'expo-constants';
import { ImagePickerIOS } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState("Games");
  const [modalVisible, setModalVisible] = useState(false);
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([{ name: "Shooters", games: 14, time: "1w" }]);
  const [username, setUsername] = useState(""); // Add state for username
  const navigation = useNavigation();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isWeb = useMediaQuery({ minWidth: 768 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditListIndex, setCurrentEditListIndex] = useState(null);
  const [editListName, setEditListName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteListIndex, setDeleteListIndex] = useState(null);
  const [profilePicModalVisible, setProfilePicModalVisible] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState(alien);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUsername(parsedUser.username); // Update state
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePicPress = () => {
    setProfilePicModalVisible(true);
  };

  const handleProfilePicSelect = async (pic, isUpload = false) => {
    if (isUpload) {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!pickerResult.canceled) {
        setSelectedProfilePic({ uri: pickerResult.assets[0].uri });
      }
    } else {
      setSelectedProfilePic(pic);
    }
  
    setProfilePicModalVisible(false);
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
    navigation.navigate("profile/settings");
  };

  const handleListPress = (index) => {
    navigation.navigate("profile/lists", { listName: lists[index].name });
  };


  const handleAddList = () => {
    if (listName.trim()) {
      const isDuplicate = lists.some(
        (list) => list.name.toLowerCase() === listName.toLowerCase()
      );
      if (isDuplicate) {
        if (Platform.OS === "web") {
          window.alert("Error, a list with this name already exists!");
        } else {
          Alert.alert("Error", "A list with this name already exists!");
        }
        return;
      }
      setLists([...lists, { name: listName, games: 0, time: "now" }]);
      setListName("");
      setModalVisible(false);
    }
  };

  const handleDeleteList = (index) => {
    setDeleteListIndex(index);
    setDeleteModalVisible(true);
  };

  const confirmDeleteList = () => {
    const newList = [...lists];
    newList.splice(deleteListIndex, 1);
    setLists(newList);
    setDeleteModalVisible(false);
  };

  const handleEditList = (index) => {
    setCurrentEditListIndex(index);
    setEditListName(lists[index].name);
    setEditModalVisible(true);
  };

  const handleUpdateListName = () => {
    const isDuplicate = lists.some(
      (list, index) =>
        list.name.toLowerCase() === editListName.toLowerCase() &&
        index !== currentEditListIndex
    );
    if (isDuplicate) {
      if (Platform.OS === "web") {
        window.alert("Error, a list with this name already exists!");
      } else {
        Alert.alert("Error", "A list with this name already exists!");
      }
      return;
    }
    const updatedLists = [...lists];
    updatedLists[currentEditListIndex].name = editListName;
    setLists(updatedLists);
    setEditModalVisible(false);
  };

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
const [favoriteGames, setFavoriteGames] = useState([]);
const [loading, setLoading] = useState(true);
 useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
  
        // If userId or token is missing, clear favorites and return early
        if (!userId || !token) {
          setFavoriteGames([]); // Clear favorites if not logged in
          return;
        }
        console.log(userId);
  
        const response = await fetch(`${BASE_URL}/api/auth/favorites/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
  
        const data = await response.json();
        setFavoriteIds(data.favorites);
        console.log('Favorite IDs:', data.favorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavoriteGames([]); // Set the favorites list to empty on error
      }
    };
  
    fetchFavorites();
  }, []);
  

useEffect(() => {
  const fetchGameById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/games/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch game with id ${id}`);
      }
      const gameData = await response.json();
      return gameData;
    } catch (error) {
      console.error('Error fetching game:', error);
      Alert.alert('Error', `Failed to load game with id ${id}`);
      return null;
    }
  };

  const fetchFavoriteGames = async () => {
    if (favoriteIds.length > 0) {
      const gamePromises = favoriteIds.map(id => fetchGameById(id));
      const games = await Promise.all(gamePromises);
      setFavoriteGames(games.filter(game => game !== null));
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  fetchFavoriteGames();
}, [favoriteIds]);

  const renderContent = () => {
    if (selectedTab === "Games") {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.tabContentText}>Games Content</ThemedText>
  
          {/* Favorite Games Section */}
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {favoriteGames.length > 0 ? (
              favoriteGames.map((game, index) => (
                <TouchableOpacity key={index} style={styles.gameCard} 
                  onPress={() =>
                    navigation.navigate("home/gameCard", { game })
                  }
                >
                  <Image source={{ uri: game.header_image }} style={styles.gameImage} />
                  <View style={styles.gameInfo}>
                    <ThemedText style={styles.gameTitle} numberOfLines={1} ellipsizeMode="tail">
                      {game.name}
                    </ThemedText>
                    <ThemedText style={styles.gameReviews} numberOfLines={2} ellipsizeMode="tail">
                      Reviews: {game.reviews || "No reviews yet"}
                    </ThemedText>
                    <ThemedText style={styles.gameDeveloper} numberOfLines={1} ellipsizeMode="tail">
                      Developer: {game.developers.join(", ")}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText>No favorite games added yet.</ThemedText>
            )}
          </ScrollView>
        </View>
      );
    } else if (selectedTab === "Lists") {
      return (
        <View style={styles.contentContainer}>
          <ScrollView>
            {lists.map((list, index) => (
              <TouchableOpacity
                key={index}
                style={styles.listItem}
                onPress={() => handleListPress(index)}
              >
                <Image source={elf} style={styles.listImage} />
                <View>
                  <ThemedText style={styles.listTitle}>{list.name}</ThemedText>
                  <ThemedText style={styles.listSubtitle}>
                    {list.games} Games
                  </ThemedText>
                  <ThemedText style={styles.listSubtitle}>
                    {list.time}
                  </ThemedText>
                </View>
                <View style={styles.listIcons}>
                  <TouchableOpacity onPress={() => handleEditList(index)}>
                    <Feather name="edit" size={18} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteList(index)}>
                    <Feather name="trash" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }
    return null;
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: "#D0D0D0",
        dark: "#353636",
      }}
      headerImage={
        <ThemedView style={styles.headerContainer}>
          <View
            style={[
              styles.iconContainer,
              isMobile ? styles.iconContainerMobile : styles.iconContainerWeb,
            ]}
          >
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
          <TouchableOpacity onPress={handleProfilePicPress}>
            <Image source={selectedProfilePic} style={styles.profileImage} />
          </TouchableOpacity>
          <ThemedText type="title">{username}</ThemedText>
        </ThemedView>
      }
    >
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Games" && styles.selectedTab]}
          onPress={() => setSelectedTab("Games")}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === "Games" && styles.selectedTabText,
            ]}
          >
            Games
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      {renderContent()}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New List</Text>
            <TextInput
              style={styles.textInput}
              placeholder="List Name"
              placeholderTextColor="#ccc"
              value={listName}
              onChangeText={setListName}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="Add" onPress={handleAddList} color="#FFA500" />
              </View>
              <View style={styles.button}>
                <Button
                  title="Close"
                  onPress={() => setModalVisible(false)}
                  color="#FFA500"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(!editModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit List Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="List Name"
              placeholderTextColor="#ccc"
              value={editListName}
              onChangeText={setEditListName}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  title="Confirm"
                  onPress={handleUpdateListName}
                  color="#FFA500"
                />
              </View>
              <View style={styles.button}>
                <Button
                  title="Close"
                  onPress={() => setEditModalVisible(false)}
                  color="#FFA500"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete List</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete '{lists[deleteListIndex]?.name}'?
            </Text>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  title="Yes"
                  onPress={confirmDeleteList}
                  color="#FFA500"
                />
              </View>
              <View style={styles.button}>
                <Button
                  title="No"
                  onPress={() => setDeleteModalVisible(false)}
                  color="#FFA500"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={profilePicModalVisible}
        onRequestClose={() => {
          setProfilePicModalVisible(!profilePicModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Profile Picture</Text>
            <ScrollView contentContainerStyle={styles.profilePicContainer}>
              <View style={styles.profilePicRow}>
                <TouchableOpacity onPress={() => handleProfilePicSelect(elf)}>
                  <Image source={elf} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleProfilePicSelect(alien)}>
                  <Image source={alien} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleProfilePicSelect(astronout)}
                >
                  <Image source={astronout} style={styles.profilePicImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.profilePicRow}>
                <TouchableOpacity
                  onPress={() => handleProfilePicSelect(criminal)}
                >
                  <Image source={criminal} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleProfilePicSelect(gamerGirl)}
                >
                  <Image source={gamerGirl} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleProfilePicSelect(guyRegular)}
                >
                  <Image source={guyRegular} style={styles.profilePicImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.profilePicRow}>
                <TouchableOpacity onPress={() => handleProfilePicSelect(mage)}>
                  <Image source={mage} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleProfilePicSelect(monster)}
                >
                  <Image source={monster} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleProfilePicSelect(ninja)}>
                  <Image source={ninja} style={styles.profilePicImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.profilePicRow}>
                <TouchableOpacity
                  onPress={() => handleProfilePicSelect(pirate)}
                >
                  <Image source={pirate} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleProfilePicSelect(superHero)}
                >
                  <Image source={superHero} style={styles.profilePicImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleProfilePicSelect(null, true)}>
                  <View style={styles.uploadContainer}>
                    <Ionicons name="cloud-upload-outline" size={40} color="white" />
                    <ThemedText style={styles.uploadText}>Upload</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.profilePicRow}>

              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  title="Close"
                  onPress={() => setProfilePicModalVisible(false)}
                  color="#FFA500"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5A639C",
    backgroundImage: "linear-gradient(to bottom, #000000, #4B0082)", // CSS gradient
    height: 330,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    top: Platform.OS === "web" ? -40 : 0,
    paddingHorizontal: 20,
  },
  iconContainerMobile: {
    top: 100,
  },
  iconContainerWeb: {
    bottom: 0,
  },
  bellIcon: {
    alignSelf: "flex-start",
  },
  settingsIcon: {
    alignSelf: "flex-end",
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 75,
    borderColor: "#808080",
    borderWidth: 2,
    margin: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFA500",
  },
  statLabel: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  selectedTab: {
    borderColor: "#FFA500",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  selectedTabText: {
    color: "#FFA500",
  },
  iconLeft: {
    position: "absolute",
    left: 10,
  },
  iconRight: {
    position: "absolute",
    right: 10,
  },
  contentContainer: {
    padding: 20,
  },
  tabContentText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  listTitle: {
    fontSize: 18,
    color: "#FFA500",
  },
  listSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  listIcons: {
    gap: 10,
    flexDirection: "row",
    marginLeft: "auto",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    width: 400,
    padding: 20,
    backgroundColor: "#353636",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    color: "#FFFFFF",
    backgroundColor: "#555",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  profilePicContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  profilePicRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  profilePicImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  gameCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  gameImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  gameInfo: {
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameReviews: {
    fontSize: 14,
    color: 'gray',
  },
  gameDeveloper: {
    fontSize: 14,
    color: 'gray',
  },
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#555',
    margin: 10,
  },
  uploadText: {
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
  },
});