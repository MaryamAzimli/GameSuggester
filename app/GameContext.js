import React, { createContext, useState, useEffect } from "react";
import { Platform } from "react-native";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [topReviewedGames, setTopReviewedGames] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      const fetchGames = async () => {
        setLoading(true);
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setGames(data);

          const sortedGames = data
            .sort((a, b) => b.reviews.length - a.reviews.length)
            .slice(0, 5);
          setTopReviewedGames(sortedGames);
          setIsDataFetched(true);
        } catch (error) {
          console.error("Failed to fetch games:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchGames();
    }
  }, [isDataFetched]);

  return (
    <GameContext.Provider value={{ games, topReviewedGames, loading }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
