import React, { useState } from "react";
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
import Bottomnav from "../components/Bottomnav";

const faqData = [
  {
    intrebare: "Care sunt pasii pentru activarea aplicatiei Mobile Banking?",
    raspuns:
      "Daca esti deja client UniCredit (UniCredit Bank sau UniCredit Consumer Financing SA) si detii un card de debit sau de credit, poti activa aplicatia Mobile Banking doar cu datele tale personale. Pentru acest proces de autentificare ai nevoie doar de cardul tau de debit sau de credit eliberat de UniCredit Bank sau UniCredit Consumer Financing si bineinteles de acces la internet. Iti poti activa singur aplicatia urmand pasii de mai jos: Descarca aplicatia Mobile Banking pe telefonul tau mobil, din App Store, Google Play sau AppGallery. Deschide aplicatia si apasa butonul Activeaza Mobile Banking. Introdu primele 6 cifre ale cardului (debit sau credit), ultimele 4 cifre ale cardului, ultimele 4 cifre din CNP, PIN-ul cardului si valideaza numarul tau de telefon. Vei primi un SMS pentru finalizarea activarii. Defineste un cod PIN din minimum 6 cifre Acest cod PIN va fi utilizat ulterior, ori de cate ori doresti sa folosesti aplicatia.",
  },
  {
    intrebare:
      "Mi-am schimbat telefonul. Ce trebuie sa fac pentru reactivarea aplicatiei?",
    raspuns:
      "Trebuie sa reinstalezi aplicatia Mobile Banking si sa o activezi din nou. Iti poti activa singur aplicatia urmand pasii de mai jos: Descarca aplicatia Mobile Banking pe telefonul tau mobil, din App Store, Google Play sau AppGallery. Deschide aplicatia si apasa butonul Activeaza Mobile Banking. Introdu primele 6 cifre ale cardului (debit sau credit), ultimele 4 cifre ale cardului, ultimele 4 cifre din CNP, PIN-ul cardului si valideaza numarul tau de telefon. Vei primi un SMS pentru finalizarea activarii. Defineste un cod PIN din minimum 6 cifre Acest cod PIN va fi utilizat ulterior, ori de cate ori doresti sa folosesti aplicatia.",
  },
  {
    intrebare:
      "Cum se pot verifica, prin Mobile Banking, platile/tranzactiile efectuate?",
    raspuns:
      "Ai urmatoarele situatii: 1.Daca ai facut tranzactii de pe cont sau cu cardurile de debit atasate acestuia si vrei sa le vezi, trebuie doar sa selectezi contul din care ai tranzactionat; Pentru fiecare cont, sub graficul lunar, poti vizualiza toate operatiunile, indiferent de statusul lor sau modalitatea in care au fost efectuate. De asemenea, ai posibilitatea sa filtrezi tranzactiile pentru a-ti fi mai usor sa o gasesti pe cea corecta. Pentru detalii, apesi/selectezi  pe tranzactia respectiva. 2.Daca ai facut tranzactii cu cardul de credit, te duci in sectiunea CARDURI si faci swipe dreapta pana identifici poza cardului tau de credit. Sub poz cardului regasesti toate tranzactiile realizate prin intermediul acestuia, inclusiv rambursarile. Pentru detalii, apesi/selectezi  pe tranzactia respectiva.",
  },
  {
    intrebare:
      "Cum modific limita de tranzactionare pentru transferuri efectuate din Online Banking/Mobile Banking?",
    raspuns:
      "Ne poti trimite un mesaj prin Online Banking (serviciu de tip Internet banking) sau ne poti suna la serviciul Info Center la +40 21 200 2020 (apel tarif normal in retele fixe) sau *2020 (apel tarif normal in retelele mobile), serviciu apelabil non-stop.",
  },
  {
    intrebare:
      "Aplicatia Mobile Banking se poate activa de pe orice telefon mobil?",
    raspuns:
      "Aplicatia se poate activa doar de pe telefoane smartphone compatibile cu sistem de operare Android sau iOS si acces la Internet. Daca detii un card (de debit sau de credit) de la UniCredit (Unicredit Bank sau UniCredit Consumer Financing SA) si ai creat un nume de utilizator, iti poti activa singur aplicatia urmand pasii de mai jos: Descarca aplicatia Mobile Banking pe telefonul tau mobil, din App Store, Google Play sau AppGallery. Deschide aplicatia si apasa butonul Activeaza Mobile Banking. Introdu primele 6 cifre ale cardului (debit sau credit), ultimele 4 cifre ale cardului, ultimele 4 cifre din CNP, PIN-ul cardului si valideaza numarul tau de telefon. Vei primi un SMS pentru finalizarea activarii. Defineste un cod PIN din minimum 6 cifre Acest cod PIN va fi utilizat ulterior, ori de cate ori doresti sa folosesti aplicatia.",
  },
];

const CallCenterScreen = ({ route, navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { user } = route.params;

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
        <Text style={styles.headerTitle}>Call Center</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {faqData.map((item, index) => (
          <View key={index} style={styles.item}>
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={styles.question}
            >
              <Text style={styles.questionText}>{item.intrebare}</Text>
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={styles.answer}>
                <Text style={styles.answerText}>{item.raspuns}</Text>
              </View>
            )}
          </View>
        ))}
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
  item: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  question: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  questionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  answer: {
    padding: 15,
  },
  answerText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default CallCenterScreen;
