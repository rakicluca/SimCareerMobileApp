import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Keyboard,
} from "react-native";
import InfoGara from "./info_Gara";
import ClassificaGara from "./classifiche_Gare";
import syncStorage from "sync-storage";

let width = Dimensions.get("screen").width;
let height = Dimensions.get("screen").height;

function getData(dataName) {
  let data = syncStorage.get(dataName);
  return JSON.parse(data);
}

const RaceStack = createStackNavigator();
const RaceStackScreen = () => (
  <RaceStack.Navigator headerMode={"none"}>
    <RaceStack.Screen name="Home" component={HomeTabNavScreen} />
    <RaceStack.Screen name="Classifica" component={ClassificaGara} />
    <RaceStack.Screen name="Info" component={InfoGara} />
  </RaceStack.Navigator>
);
const HomeTabNav = createMaterialTopTabNavigator();
const HomeTabNavScreen = () => (
  <HomeTabNav.Navigator
    lazy={true}
    tabBarPosition="top"
    initialRouteName="Gare"
    initialLayout={{ width: Dimensions.get("window").width }}
    tabBarOptions={{
      showLabel: true,
      style: { paddingTop: 5, backgroundColor: "rgba(51, 102, 255, 1)" },
      inactiveTintColor: "rgba(255, 255, 255, 0.5)",
      activeTintColor: "white",
      indicatorStyle: { backgroundColor: "white" },
    }}
    backBehavior={"order"}
  >
    <HomeTabNav.Screen
      name="Classifiche"
      component={ClassificaGara}
      initialParams={{
        idCampionato: getData("idCampionato"),
        idGara: getData("gara").idCircuito,
      }}
    ></HomeTabNav.Screen>
    <HomeTabNav.Screen
      onswipe
      name="Info"
      component={InfoGara}
      initialParams={{
        gara: getData("gara"),
        campionato: getData("campionato"),
      }}
    ></HomeTabNav.Screen>
  </HomeTabNav.Navigator>
);

export default function Gara({ route }) {
  let logoURL = route.params.gara.url;
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(51, 102, 255, 0.6)" }}>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          marginTop: "10%",
        }}
      >
        <View
          style={{
            marginHorizontal: "3%",
            justifyContent: "center",
            alignSelf: "center",
            backgroundColor: "white",
            borderRadius: 170,
          }}
        >
          <Image
            style={{
              width: 160,
              height: 160,
              borderRadius: 170 / 2,
              resizeMode: "contain",
            }}
            source={{
              uri: logoURL,
            }}
          ></Image>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Text style={styles.nomeCampionato}>{route.params.gara.nome}</Text>
          <Text style={styles.infoCampionato}>
            Data inizio gara:{" "}
            {route.params.campionato.calendario[route.params.index].data}
          </Text>
          <Text style={styles.infoCampionato}>
            Numero di partecipanti:{" "}
            {route.params.campionato.piloti_iscritti.length}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 3,
          marginTop: height > 800 ? 0 : "2%",
        }}
      >
        <RaceStackScreen></RaceStackScreen>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  nomeCampionato: {
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "spyagencygrad",
  },
  infoCampionato: {
    fontSize: 15,
    marginVertical: "2%",
  },
  buttonIscriviti: {
    width: width / 3,
    backgroundColor: "white",
    alignSelf: "center",
  },
  buttonIscrivitiText: {
    color: "black",
  },
  modalContainer: {
    backgroundColor: "white",
    //height: heigth > 800 ? heigth / 3.5 : heigth / 3,
    width: "100%",
    padding: "5%",
  },
  modalContent: { marginTop: "5%" },
  modalTitle: {
    fontSize: 22,
  },
  modalBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
  },
  modalBottom: {
    alignItems: "center",
    marginTop: height > 800 ? "10%" : "5%",
  },
  modalButton: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00BCD4",
  },
});
