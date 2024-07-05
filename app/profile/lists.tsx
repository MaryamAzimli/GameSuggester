import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useRoute } from "@react-navigation/native";

const Lists = () => {
  const route = useRoute();
  const { listName } = route.params;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{listName}</ThemedText>
    </ThemedView>
  );
};

export default Lists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
