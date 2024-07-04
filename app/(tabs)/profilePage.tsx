import React, { useState } from "react";
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
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import octopusImage from "@/assets/images/octopus.png";
import { Feather } from "@expo/vector-icons";
import { useMediaQuery } from "react-responsive";
import { Ionicons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState("Games");
  const [modalVisible, setModalVisible] = useState(false);
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([
    { name: "Shooters", games: 14, time: "1w" },
  ]);

  const navigation = useNavigation();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isWeb = useMediaQuery({ minWidth: 768 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditListIndex, setCurrentEditListIndex] = useState(null);
  const [editListName, setEditListName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleBellPress = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setSnackbarMessage(
      notificationsEnabled
        ? "Notifications have been disabled"
        : "Notifications have been enabled"
    );
    setSnackbarVisible(true);
  };

  const handleSettingsPress = () => {
    // Navigate to Settings screen
    navigation.navigate("inPages/settings");
  };

  const handleAddList = () => {
    if (listName.trim()) {
      setLists([...lists, { name: listName, games: 0, time: "now" }]);
      setListName("");
      setModalVisible(false);
    }
  };

  const handleDeleteList = (index) => {
    const newList = [...lists];
    newList.splice(index, 1);
    setLists(newList);
  };

  const handleEditList = (index) => {
    setCurrentEditListIndex(index);
    setEditListName(lists[index].name);
    setEditModalVisible(true);
  };

  const handleUpdateListName = () => {
    const updatedLists = [...lists];
    updatedLists[currentEditListIndex].name = editListName;
    setLists(updatedLists);
    setEditModalVisible(false);
  };

  const renderContent = () => {
    if (selectedTab === "Games") {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.tabContentText}>Games Content</ThemedText>
        </View>
      );
    } else if (selectedTab === "Lists") {
      return (
        <View style={styles.contentContainer}>
          <ScrollView>
            {lists.map((list, index) => (
              <View key={index} style={styles.listItem}>
                <Image source={octopusImage} style={styles.listImage} />
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
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }
    return null;
  };

  const handlePlusPress = () => {
    setModalVisible(true);
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

          <Image source={octopusImage} style={styles.profileImage} />
          <ThemedText type="title">Octo the Gamer</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>87.8K</ThemedText>
              <ThemedText style={styles.statLabel}>Followers</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>526</ThemedText>
              <ThemedText style={styles.statLabel}>Following</ThemedText>
            </View>
          </View>
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
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Lists" && styles.selectedTab]}
          onPress={() => setSelectedTab("Lists")}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === "Lists" && styles.selectedTabText,
            ]}
          >
            Lists
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => selectedTab === "Lists" && handlePlusPress()}
        >
          <Feather name="plus" size={24} color="white" />
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
      <View style={{ ...styles.snackbarContainer, zIndex: 1000 }}>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_SHORT}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
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
    paddingHorizontal: 20,
  },
  iconContainerMobile: {
    top: 0,
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
    width: 100,
    height: 100,
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
    width: 300,
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
  snackbarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 1000,
  },
  snackbar: {
    backgroundColor: "#353636",
  },
});
