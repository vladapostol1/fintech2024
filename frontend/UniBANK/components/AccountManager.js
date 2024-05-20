import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function AccountManager({ user }) {
  const [accounts, setAccounts] = useState([
    { account_name: "Main Account", account_balance: user.account_balance },
    ...user.managed_accounts,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "0.00";
    }
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSwipeLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : accounts.length - 1
    );
  };

  const handleSwipeRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < accounts.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentAccount = accounts[currentIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.swipeButton} onPress={handleSwipeLeft}>
        <Image
          source={require("../assets/left-w.png")}
          style={styles.iconButton}
        />
      </TouchableOpacity>
      <View style={styles.balanceHolder}>
        <Text style={styles.accountName}>{currentAccount.account_name}</Text>
        <Text style={styles.balanceText}>My Balance</Text>
        <View style={styles.balance}>
          <Text style={styles.amount}>
            {formatAmount(currentAccount.account_balance)}
          </Text>
          <Text style={styles.valut}>lei</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.swipeButton} onPress={handleSwipeRight}>
        <Image
          source={require("../assets/right-w.png")}
          style={styles.iconButton}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 20,
  },
  balance: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  amount: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  valut: {
    color: "#D86045",
    fontSize: 24,
    marginBottom: 5,
  },
  accountName: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  balanceHolder: {
    alignItems: "center",
  },
  balanceText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  swipeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 8,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 20,
    height: 20,
  },
});
