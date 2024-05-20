import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem("userCredentials");
        if (storedCredentials) {
          const parsedCredentials = JSON.parse(storedCredentials);
          setCredentials(parsedCredentials);
          await fetchUserData(
            parsedCredentials.username,
            parsedCredentials.password
          );
        }
      } catch (error) {
        console.error("Failed to load credentials", error);
      }
    };
    loadCredentials();
  }, []);

  const updateCredentials = async (username, password) => {
    const newCredentials = { username, password };
    setCredentials(newCredentials);
    await AsyncStorage.setItem(
      "userCredentials",
      JSON.stringify(newCredentials)
    );
  };

  const fetchUserData = async (username, password) => {
    if (!username || !password) {
      console.error("Username and password are required");
      return;
    }
    try {
      const response = await fetch("http://172.20.10.6:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("userCredentials");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        credentials,
        isAuthenticated,
        updateCredentials,
        fetchUserData,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
