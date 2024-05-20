import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignScreen({ route, navigation }) {
  const { user, fromIban, toIban, toName, amount } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSendMoney = async () => {
    const response = await fetch("http://0.0.0.0:5000/send_money", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_iban: fromIban,
        to_iban: toIban,
        to_name: toName,
        to_reason: "Sending money",
        amount: amount,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setModalMessage("Transaction successful!");
      setIsError(false);
      setModalVisible(true);
    } else {
      setModalMessage(data.error);
      setIsError(true);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    if (!isError) {
      navigation.navigate("SimpleInterface", { user });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/left-w.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Transaction</Text>
      </View>
      <View style={styles.confirmationContainer}>
        <Text style={styles.confirmationText}>From: {fromIban}</Text>
        <Text style={styles.confirmationText}>To: {toIban}</Text>
        <Text style={styles.confirmationText}>Name: {toName}</Text>
        <Text style={styles.confirmationText}>Amount: {amount} lei</Text>
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
        <Text style={styles.sendButtonText}>Confirm and Send</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  confirmationContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  confirmationText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: "#007A91",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 1)",
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
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#007A91",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
