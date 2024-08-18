import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import GameContext from '../GameContext'; 

const { BASE_URL } = Constants.expoConfig?.extra || {};

const Lists = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { games, loading } = useContext(GameContext);
  console.log(games);
  useEffect(() => {
    
    const fetchFavorites = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        
        if (userId && token) {
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

  // Filter games based on favorite IDs
  const favoriteGames = games?.filter(game => favoriteIds.includes(game.id)) || [];

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {favoriteGames.length > 0 ? (
          favoriteGames.map((game, index) => (
            <TouchableOpacity key={index} style={styles.gameCard}>
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
});
