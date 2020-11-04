import React, { useState } from "react";
import { useFonts } from "expo-font";
import { AppLoading } from "expo";
import { CommonActions } from "@react-navigation/native";
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
import { Button } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import Info from "./info";
import ClassificaCampionati from "./classifiche_Campionati";
import Gare from "./gare";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-community/async-storage";
import SyncStorage from "sync-storage";

let width = Dimensions.get("screen").width;
let heigth = Dimensions.get("screen").height;
console.log("W: " + width + "H: " + heigth);

function getData() {
  /* let data = [];
  try {
    data = await AsyncStorage.getItem("listagare");
    console.log(data);
  } catch (error) {}
  return data; */

  let data = SyncStorage.get("listagare");
  console.log(data);
  return JSON.parse(data);
}

const ChampionStack = createStackNavigator();
const ChampionStackScreen = () => (
  <ChampionStack.Navigator headerMode={"none"}>
    <ChampionStack.Screen name="Home" component={HomeTabNavScreen} />
    <ChampionStack.Screen name="Classifiche" component={ClassificaCampionati} />
    <ChampionStack.Screen name="Gare" component={Gare} />
    <ChampionStack.Screen name="Info" component={Info} />
  </ChampionStack.Navigator>
);
const HomeTabNav = createMaterialTopTabNavigator();
const HomeTabNavScreen = () => (
  <HomeTabNav.Navigator
    lazy={true}
    tabBarPosition="top"
    initialRouteName="Gare"
    initialLayout={{ width: Dimensions.get("window").width }}
    tabBarOptions={{
      showIcon: true,
      showLabel: "true",
      style: { paddingTop: 5, backgroundColor: "rgba(51, 102, 255, 1)" },
      inactiveTintColor: "rgba(255, 255, 255, 0.5)",
      activeTintColor: "white",
      indicatorStyle: { backgroundColor: "white" },
    }}
  >
    <HomeTabNav.Screen
      name="Gare"
      component={Gare}
      initialParams={{ listaGare: getData() }}
    ></HomeTabNav.Screen>
    <HomeTabNav.Screen
      name="Classifiche"
      component={ClassificaCampionati}
    ></HomeTabNav.Screen>
    <HomeTabNav.Screen onswipe name="Info" component={Info}></HomeTabNav.Screen>
  </HomeTabNav.Navigator>
);
export default function Campionati({ route }) {
  let logoURL = route.params.campionato.logo;
  let gare = route.params.campionato.calendario;
  //Load custom font
  const [isLoaded] = useFonts({
    spyagencygrad: require("../../assets/fonts/SpyAgency/spyagency3grad.ttf"),
    spyagencynorm: require("../../assets/fonts/SpyAgency/spyagency3.ttf"),
  });
  if (!isLoaded) {
    return <AppLoading />;
  } else {
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
            }}
          >
            <Image
              style={{
                width: 160,
                height: 160,
                borderRadius: 170 / 2,
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
            <Text style={styles.nomeCampionato}>
              {route.params.campionato.nome}
            </Text>
            <Text style={styles.infoCampionato}>
              Numero di partecipanti:{" "}
              {route.params.campionato.piloti_iscritti.length}
            </Text>
            <Text style={styles.infoCampionato}>
              Data inizio/prima gara:{" "}
              {route.params.campionato.calendario[0].data}
            </Text>
            <Text style={styles.infoCampionato}>
              Data fine/ultima gara:{" "}
              {route.params.campionato.calendario[gare.length - 1].data}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 3,
            marginTop: heigth > 800 ? 0 : "2%",
          }}
        >
          {/* TABELLA CON LE GARE */}
          <ChampionStackScreen></ChampionStackScreen>
        </View>
      </View>
    );
  }
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
});
