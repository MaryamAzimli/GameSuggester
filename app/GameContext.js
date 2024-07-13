import React, { createContext, useState, useEffect } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [topReviewedGames, setTopReviewedGames] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const url = `http://139.179.208.27:3000/api/games?page=1&limit=100`; // Fetch a large enough limit to avoid pagination for now
        const response = await fetch(url);
        const data = await response.json();

        setGames(data);
        const sortedGames = data.sort((a, b) => b.reviews.length - a.reviews.length).slice(0, 5);
        setTopReviewedGames(sortedGames);
        setIsDataFetched(true);
        console.log("Games fetched and set in context:", data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    if (!isDataFetched) {
      fetchGames();
    }
  }, [isDataFetched]);

  return (
    <GameContext.Provider value={{ games, topReviewedGames }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
