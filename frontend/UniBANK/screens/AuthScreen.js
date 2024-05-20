import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useUser } from "../contexts/UserContext";

export default function AuthScreen({ navigation }) {
  const { credentials, fetchUserData } = useUser();
  const [password, setPassword] = useState("");

  useEffect(() => {
    authenticateWithBiometrics();
  }, []);

  const authenticateWithBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedAuthTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        fetchUserData(credentials.username, credentials.password);
        navigation.navigate("Select");
      }
    }
  };

  const handlePasswordAuth = async () => {
    if (password === credentials.password) {
      fetchUserData(credentials.username, credentials.password);
      navigation.navigate("Select");
    } else {
      Alert.alert("Authentication failed", "Invalid password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter your password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordAuth}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#242424",
  },
  header: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderRadius: 16,
    marginBottom: 12,
    padding: 8,
    width: "100%",
    fontSize: 16,
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  button: {
    backgroundColor: "#007A91",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
