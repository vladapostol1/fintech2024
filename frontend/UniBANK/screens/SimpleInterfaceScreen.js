import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Navbar from "../components/Navbar";
import AccountManager from "../components/AccountManager";
import { useUser } from "../contexts/UserContext";
import BottomNav from "../components/Bottomnav";

export default function SimpleInterfaceScreen({ route, navigation }) {
  const { user: contextUser, fetchUserData, credentials } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = route.params || {}; // Fetch user from route params if available

  useEffect(() => {
    if (!user && credentials.username && credentials.password) {
      fetchUserData(credentials.username, credentials.password);
    }
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!contextUser && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentUser = user || contextUser;

  return (
    <SafeAreaView style={styles.container}>
      <Navbar style={styles.navbar} />
      <AccountManager user={currentUser} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={openModal}>
          <Image source={require("../assets/menu.png")} style={styles.icon} />
          <Text style={styles.textButton1}>Account details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button1}
          onPress={() =>
            navigation.navigate("Transaction", { user: currentUser })
          }
        >
          <Image source={require("../assets/tran.png")} style={styles.icon} />
          <Text style={styles.textButton1}>History Transaction</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            navigation.navigate("NewTransaction", { user: currentUser })
          }
        >
          <Text style={styles.buttonNextText}>+ New Transaction</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Account Details</Text>
            <Text style={styles.modalText}>IBAN: {currentUser.IBAN}</Text>
            <Text style={styles.modalText}>
              Name: {currentUser.name} {currentUser.surname}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNav user={user} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 16,
  },
  navbar: {
    position: "absolute",
    top: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
  },
  button1: {
    borderRadius: 12,
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  textButton1: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 5,
  },
  icon: {
    height: 24,
    width: 24,
  },
  nextButton: {
    backgroundColor: "#007A91",
    padding: 28,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonNextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#007A91",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
