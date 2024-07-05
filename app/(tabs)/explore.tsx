import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useMediaQuery } from "react-responsive";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

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
        <View style={styles.gameCard}>
          <Image source={{ uri: "h" }} style={styles.gameImage} />
          <View style={styles.liveBadge}>
            <ThemedText style={styles.liveText}>LIVE</ThemedText>
          </View>
          <View style={styles.viewersBadge}>
            <ThemedText style={styles.viewersText}>8.1K</ThemedText>
          </View>
        </View>
        <View style={styles.gameCard}>
          <Image source={{ uri: "h" }} style={styles.gameImage} />
          <View style={styles.liveBadge}>
            <ThemedText style={styles.liveText}>LIVE</ThemedText>
          </View>
          <View style={styles.viewersBadge}>
            <ThemedText style={styles.viewersText}>415</ThemedText>
          </View>
        </View>
        <View style={styles.gameCard}>
          <Image source={{ uri: "h" }} style={styles.gameImage} />
          <View style={styles.liveBadge}>
            <ThemedText style={styles.liveText}>LIVE</ThemedText>
          </View>
          <View style={styles.viewersBadge}>
            <ThemedText style={styles.viewersText}>8.1K</ThemedText>
          </View>
        </View>
        <View style={styles.gameCard}>
          <Image source={{ uri: "h" }} style={styles.gameImage} />
          <View style={styles.liveBadge}>
            <ThemedText style={styles.liveText}>LIVE</ThemedText>
          </View>
          <View style={styles.viewersBadge}>
            <ThemedText style={styles.viewersText}>415</ThemedText>
          </View>
        </View>
        <View style={styles.gameCard}>
          <Image source={{ uri: "h" }} style={styles.gameImage} />
          <View style={styles.liveBadge}>
            <ThemedText style={styles.liveText}>LIVE</ThemedText>
          </View>
          <View style={styles.viewersBadge}>
            <ThemedText style={styles.viewersText}>8.1K</ThemedText>
          </View>
        </View>
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
  liveBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  liveText: {
    color: "white",
    fontSize: 12,
  },
  viewersBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  viewersText: {
    color: "white",
    fontSize: 12,
  },
});
