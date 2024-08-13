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
        let url = `https://e6aa-94-20-207-112.ngrok-free.app/api/games?page=1&limit=100`; // Fetch a large enough limit to avoid pagination for now
        if (Platform.OS === "android" || Platform.OS === "ios") {
          url = `https://e6aa-94-20-207-112.ngrok-free.app/api/games?page=1&limit=100`; // Replace with your actual local IP address
        }
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
