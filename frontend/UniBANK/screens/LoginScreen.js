import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { StatusBar } from "expo-status-bar";
import { useUser } from "../contexts/UserContext";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "EN", value: "en" },
    { label: "RO", value: "ro" },
  ]);
  const [value, setValue] = useState(items[0].value);
  const { updateCredentials, fetchUserData } = useUser();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://0.0.0.0:5000/login", {
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
        updateCredentials(username, password);
        await fetchUserData(username, password);
        navigation.navigate("Select", { user: data.user });
      } else {
        Alert.alert("Login failed", data.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          containerStyle={styles.dropdown}
          style={styles.dropdownStyle}
          dropDownContainerStyle={styles.dropDownContainerStyle}
          textStyle={styles.textStyle}
          arrowIconStyle={styles.arrowIconStyle}
        />
      </View>
      <Image source={require("../assets/logo_main.png")} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: "absolute",
    top: 40,
    right: 10,
    zIndex: 1000,
  },
  dropdown: {
    width: 70,
  },
  dropdownStyle: {
    borderWidth: 0,
    height: 30,
    backgroundColor: "#242424",
  },
  dropDownContainerStyle: {
    borderWidth: 0,
    backgroundColor: "#242424",
  },
  textStyle: {
    color: "#ffffff",
  },
  arrowIconStyle: {
    paddingLeft: 0,
    tintColor: "#ffffff",
  },
  logo: {
    width: 250,
    marginTop: -160,
    marginBottom: 40,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
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
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});
