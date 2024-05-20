import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider, useUser } from "./contexts/UserContext";
import SimpleInterfaceScreen from "./screens/SimpleInterfaceScreen";
import TransactionScreen from "./screens/TransactionScreen";
import NewTransactionScreen from "./screens/NewTransactionScreen";
import SelectScreen from "./screens/SelectScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthScreen from "./screens/AuthScreen"; // If using AuthScreen
import CallCenterScreen from "./screens/CallCenterScreen";
import BranchesScreen from "./screens/BranchesScreen";
import SignScreen from "./screens/SignScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { credentials, fetchUserData, user, isAuthenticated } = useUser();

  useEffect(() => {
    if (credentials.username && credentials.password) {
      fetchUserData(credentials.username, credentials.password);
    }
  }, [credentials]);

  return (
    <Stack.Navigator
      initialRouteName={
        isAuthenticated ? "Select" : credentials.username ? "Auth" : "Login"
      }
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Select"
        component={SelectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SimpleInterface"
        component={SimpleInterfaceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CallCenter"
        component={CallCenterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Branches"
        component={BranchesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sign"
        component={SignScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
