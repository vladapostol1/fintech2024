import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTransactionScreen({ route, navigation }) {
  const { user } = route.params;
  const [fromIban, setFromIban] = useState(user.IBAN);
  const [toIban, setToIban] = useState("");
  const [toName, setToName] = useState("");
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(user.IBAN);
  const [items, setItems] = useState([
    { label: `Main Account (${user.IBAN})`, value: user.IBAN },
    ...user.managed_accounts.map((account) => ({
      label: `${account.account_name} (${account.IBAN})`,
      value: account.IBAN,
    })),
  ]);

  const handleNext = () => {
    navigation.navigate("Sign", {
      user,
      fromIban,
      toIban,
      toName,
      amount,
    });
  };

  useEffect(() => {
    setFromIban(value);
  }, [value]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/left-w.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
      </View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={styles.picker}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        textStyle={styles.textStyle}
      />
      <TextInput
        style={styles.input}
        placeholder="To IBAN"
        placeholderTextColor="#ccc"
        value={toIban}
        onChangeText={setToIban}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#ccc"
        value={toName}
        onChangeText={setToName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#ccc"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleNext}>
        <Text style={styles.sendButtonText}>Next</Text>
      </TouchableOpacity>
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
  picker: {
    height: 50,
    width: "100%",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 8,
    marginBottom: 16,
  },
  dropDownContainerStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  textStyle: {
    color: "#fff",
  },
  input: {
    height: 50,
    width: "100%",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
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
});
