import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { BASE_URL } = Constants.expoConfig?.extra || {};

const Lists = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        
        if (userId && token) {
          const response = await fetch(`${BASE_URL}/api/favorites/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch favorites');
          }

          const data = await response.json();
          setFavorites(data.favorites);
        } else {
          Alert.alert('Error', 'User ID or Token not found');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        Alert.alert('Error', 'Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleAddFavorite = async (appid: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      if (token && userId) {
        const response = await fetch(`${BASE_URL}/api/addFavorite`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, appid }),
        });

        const data = await response.json();

        if (response.ok && data.message === 'Game added to favorites') {
          setFavorites(prevFavorites => [...prevFavorites, appid]);
        } else {
          console.error(data.error);
          Alert.alert('Error', data.error || 'Failed to add game to favorites');
        }
      } else {
        Alert.alert('Error', 'No token or user ID found');
      }
    } catch (error) {
      console.error('Error adding game to favorites:', error);
      Alert.alert('Error', 'Failed to add game to favorites');
    }
  };

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
        <Button title="Add Game" onPress={() => handleAddFavorite('new-game-appid')} />
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
