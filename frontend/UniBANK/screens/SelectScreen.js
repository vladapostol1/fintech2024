import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function SelectScreen({ route, navigation }) {
  const { user } = route.params;
  const [selectedOption, setSelectedOption] = useState(0);
  const [error, setError] = useState("");

  const handleNextScreen = () => {
    if (selectedOption === 0) {
      setError("No View Selected");
    } else {
      if (selectedOption === 1) {
        navigation.navigate("SimpleInterface", { user });
      } else {
        navigation.navigate("AdvancedInterface", { user });
      }
    }
  };

  const switchView = (val) => {
    setSelectedOption(val);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Mode</Text>
      <View style={styles.buttonHolder}>
        <TouchableOpacity onPress={() => switchView(1)} style={styles.button}>
          <Image
            source={require("../assets/Rabbit.webp")}
            style={[
              styles.icon,
              selectedOption == 1 ? styles.selectedButton : null,
            ]}
          />
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => switchView(2)} style={styles.button}>
          <Image
            source={require("../assets/Turtle.webp")}
            style={[
              styles.icon,
              selectedOption == 2 ? styles.selectedButton : null,
            ]}
          />
          <Text style={styles.buttonText}>Advanced</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity onPress={handleNextScreen} style={styles.nextButton}>
        <Text style={styles.buttonNextText}>Next</Text>
        <Image
          source={require("../assets/right-w.png")}
          style={styles.iconButton}
        />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: {
    color: "#fff",
    fontSize: 32,
    marginTop: -300,
    marginBottom: 100,
    fontWeight: "light",
  },
  buttonHolder: {
    flexDirection: "row",
    gap: 50,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  iconButton: {
    width: 16,
    height: 16,
    tintColor: "#fff",
  },
  button: {
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginTop: 24,
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton: {
    width: "100%",
    position: "absolute",
    bottom: 32,
    marginBottom: 0,
    padding: 24,
    backgroundColor: "#007A91",
    borderRadius: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonNextText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  selectedButton: {
    borderColor: "white",
    borderWidth: 3,
  },
});
