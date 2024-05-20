import React from "react";
import { View, StyleSheet, Image } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/blank_profile.png")}
        style={styles.profile}
      />
      <Image source={require("../assets/logo_main.png")} style={styles.logo} />
      <View style={styles.spacer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 20,
  },
  profile: {
    width: 32,
    height: 32,
    borderRadius: 20,
  },
  logo: {
    marginLeft: 30,
    width: 180,
    resizeMode: "contain",
  },
  spacer: {
    width: 40,
  },
});
