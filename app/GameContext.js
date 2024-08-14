import React, { createContext, useState, useEffect, useCallback } from 'react';
import Constants from 'expo-constants';

// Simple debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const { BASE_URL } = Constants.expoConfig?.extra || {};
console.log('BASE_URL:', BASE_URL);

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchGames = useCallback(debounce(async () => {
    setLoading(true);

    let url = `${BASE_URL}/api/games?page=1&limit=100`;
    if (selectedTags.length > 0) {
      const tagsQuery = selectedTags.join(',');
      url += `&tags=${tagsQuery}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGames(data);

      const sortedGames = data
        .sort((a, b) => {
          const positiveComparison = b.positive - a.positive;
          if (positiveComparison !== 0) return positiveComparison;
          return a.negative - b.negative;
        })
        .slice(0, 5);
      setTopGames(sortedGames);
      setIsDataFetched(true);
    } catch (error) {
      console.error('Failed to fetch games:', error.message);
    } finally {
      setLoading(false);
    }
  }, 300), [selectedTags]); // Debounce when selectedTags changes

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    // Set filtered games based on the fetched games
    setFilteredGames(games);
  }, [games]); // Trigger filtering when games data changes

  const addTag = tag => {
    setSelectedTags(prevTags => [...prevTags, tag]);
  };

  const removeTag = tag => {
    setSelectedTags(prevTags => prevTags.filter(t => t !== tag));
  };

  return (
    <GameContext.Provider value={{ games, topGames, filteredGames, loading, addTag, removeTag, selectedTags }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
