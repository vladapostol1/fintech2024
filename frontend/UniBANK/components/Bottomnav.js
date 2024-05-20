import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const BottomNav = ({ user }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.fixedBot}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SimpleInterface", { user })}
        >
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Transaction", { user })}
        >
          <Ionicons name="list" size={24} color="#fff" />
          <Text style={styles.buttonText}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CallCenter", { user })}
        >
          <Ionicons name="call" size={24} color="#fff" />
          <Text style={styles.buttonText}>Call Center</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Branches", { user })}
        >
          <Ionicons name="location" size={24} color="#fff" />
          <Text style={styles.buttonText}>Branches</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#242424",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  button: {
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
  fixedBot: {
    position: "absolute",
    bottom: 20,
  },
});

export default BottomNav;
