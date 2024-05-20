import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Bottomnav from "../components/Bottomnav";

export default function TransactionScreen({ route, navigation }) {
  const { user } = route.params;

  const renderItem = ({ item }) => {
    const isReceived = item.to === user.IBAN;

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionText}>
            {isReceived ? `${item.from}` : `${item.to_name}`}
          </Text>
          <Text style={styles.transactionText}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        <Text style={isReceived ? styles.amountReceived : styles.amountSent}>
          {isReceived ? "+" : "-"} {item.amount} lei
        </Text>
      </View>
    );
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
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>
      <FlatList
        data={user.history_transactions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.transactionList}
      />
      <Bottomnav user={user} />
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
  transactionList: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionText: {
    color: "#fff",
    fontSize: 14,
  },
  amountReceived: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
  amountSent: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "bold",
  },
});
