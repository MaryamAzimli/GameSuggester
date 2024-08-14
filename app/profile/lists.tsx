import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'; // Import Constants

const { BASE_URL } = Constants.expoConfig?.extra || {}; // Access BASE_URL from app.json

const Lists = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      
      if (userId && token) {
        fetch(`${BASE_URL}/api/favorites/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setFavorites(data.favorites);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching favorites:', error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {favorites.length > 0 ? (
          favorites.map((appid, index) => (
            <TouchableOpacity key={index} style={styles.gameCard}>
              <Image source={{ uri: `https://example.com/games/${appid}/image.png` }} style={styles.gameImage} />
              <ThemedText>{appid}</ThemedText>
            </TouchableOpacity>
          ))
        ) : (
          <ThemedText>No favorite games added yet.</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default Lists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
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
});
