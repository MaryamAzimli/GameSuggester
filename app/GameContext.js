import React, { createContext, useState, useEffect } from 'react';
import Constants from 'expo-constants';

const { BASE_URL } = Constants.expoConfig?.extra || {};
console.log('BASE_URL:', BASE_URL);

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      const fetchGames = async () => {
        setLoading(true);
        let url = `${BASE_URL}/api/games?page=1&limit=100`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setGames(data);

          const sortedGames = data
            .sort((a, b) => {
              // Sort by positive reviews in descending order
              const positiveComparison = b.positive - a.positive;
              if (positiveComparison !== 0) return positiveComparison;

              // If positive reviews are equal, sort by negative reviews in ascending order
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
      };

      fetchGames();
    }
  }, [isDataFetched]);

  return (
    <GameContext.Provider value={{ games, topGames, loading }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
