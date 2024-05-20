import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import Bottomnav from "../components/Bottomnav";

const BranchesScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const fetchBranches = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://0.0.0.0:5000/find_branches?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();
      if (response.ok) {
        const branchesWithDistance = data.map((branch) => ({
          ...branch,
          distance: calculateDistance(
            latitude,
            longitude,
            branch.location.lat,
            branch.location.lng
          ),
        }));
        setBranches(branchesWithDistance);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch branches.");
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
    fetchBranches(location.coords.latitude, location.coords.longitude);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/left-w.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Branches</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : branches.length === 0 ? (
          <Text style={styles.noBranchesText}>No branches found.</Text>
        ) : (
          branches.map((branch, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <Text style={styles.branchAddress}>{branch.address}</Text>
              <Text style={styles.branchDistance}>
                Distance: {branch.distance.toFixed(2)} km
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <Bottomnav user={user} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 16,
  },
  scrollView: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  noBranchesText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  item: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
  },
  branchName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  branchAddress: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  branchDistance: {
    color: "#fff",
    fontSize: 14,
  },
});

export default BranchesScreen;
