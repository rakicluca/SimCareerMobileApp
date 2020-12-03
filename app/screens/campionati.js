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
import { Button, Icon } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import Info from "./info_Campionato";
import ClassificaCampionati from "./classifiche_Campionati";
import Gare from "./gare";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SyncStorage from "sync-storage";
import config from "../config/config";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import syncStorage from "sync-storage";

let width = Dimensions.get("screen").width;
let heigth = Dimensions.get("screen").height;

function getData(dataName) {
  let data = SyncStorage.get(dataName);
  return JSON.parse(data);
}

async function updateLocalCampionato(idCampionato, setNumeroPartecipanti) {
  await fetch(config.url.path + "/campionati/" + idCampionato)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log("status not 200");
      }
    })
    .then((res) => {
      syncStorage.set("campionato", JSON.stringify(res));
      setNumeroPartecipanti(res.piloti_iscritti.length);
    });
}

async function sub_ToChamp(idCampionato, pickedTeam, pickedVettura) {
  let idutente = SyncStorage.get("utente").id;
  let nomeUtente = SyncStorage.get("utente").nome;
  let cognomeUtente = SyncStorage.get("utente").cognome;

  await fetch(config.url.path + "/campionati/iscriviToChamp/" + idCampionato, {
    method: "POST",
    dataType: "json",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idUtente: idutente,
      auto: pickedVettura,
      team: pickedTeam,
      nome: nomeUtente + " " + cognomeUtente,
    }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      console.log("status not 200");
    }
  });
}

async function removeUtenteFromChamp(idCampionato) {
  let idutente = SyncStorage.get("utente").id;
  try {
    await fetch(
      config.url.path +
        "/campionati/removeFromChamp/" +
        idCampionato +
        "/" +
        idutente,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log("status not 200");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function getListaVetture(listaVetture) {
  let array = [];

  listaVetture.forEach((element, index) => {
    array.push({ label: element, value: index });
  });
  return array;
}

async function getListaTeam() {
  let data = await fetch(config.url.path + "/team");
  let listaTeam = await data.json();

  return listaTeam;
}

function createArrayTeam(listaTeam) {
  let array = [];
  listaTeam.forEach((element, index) => {
    array.push({ label: element.nome, value: index });
  });
  return array;
}

async function checkIsSub(idCampionato) {
  return await fetch(
    config.url.path +
      "/campionati/checkSub/" +
      idCampionato +
      "/" +
      SyncStorage.get("utente").id
  ).then((res) => {
    return res.json();
  });
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
      showLabel: true,
      style: { paddingTop: 5, backgroundColor: "rgba(51, 102, 255, 1)" },
      inactiveTintColor: "rgba(255, 255, 255, 0.5)",
      activeTintColor: "white",
      indicatorStyle: { backgroundColor: "white" },
    }}
    backBehavior={"order"}
  >
    <HomeTabNav.Screen
      name="Gare"
      component={Gare}
      initialParams={{
        calendario: getData("campionato").calendario,
      }}
    ></HomeTabNav.Screen>
    <HomeTabNav.Screen
      name="Classifiche"
      component={ClassificaCampionati}
      initialParams={{ idCampionato: getData("idCampionato") }}
    ></HomeTabNav.Screen>
    <HomeTabNav.Screen
      onswipe
      name="Info"
      component={Info}
      initialParams={{ campionato: getData("campionato") }}
    ></HomeTabNav.Screen>
  </HomeTabNav.Navigator>
);
export default function Campionati({ navigation, route }) {
  let logoURL = route.params.campionato.logo;
  let gare = route.params.campionato.calendario;
  let listaVettureChamp = getListaVetture(route.params.campionato.lista_auto);
  const [listaTeam, setListaTeam] = useState([]);
  const [isSub, setIsSub] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pickedVettura, setPickedVettura] = useState([]);
  const [pickedTeam, setPickedTeam] = useState([]);
  const [numero_partecipanti, setNumeroPartecipanti] = useState(
    getData("campionato").piloti_iscritti.length
  );
  React.useEffect(() => {
    getListaTeam().then((res) => {
      let tmp = createArrayTeam(res);
      setListaTeam(tmp);
    });

    checkIsSub(route.params.campionato.id).then((res) => {
      if (res.status == "200") setIsSub(true);
    });
  }, []);
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
        {/* MODAL FOR SUBSCRIBE TO CHAMP */}
        <Modal
          isVisible={isVisible}
          onBackdropPress={() => {
            setIsVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleziona</Text>
            <View style={styles.modalContent}>
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>Vettura</Text>
                <DropDownPicker
                  items={listaVettureChamp}
                  itemStyle={{ justifyContent: "flex-start" }}
                  placeholder="Seleziona una vettura"
                  placeholderStyle={{ justifyContent: "flex-start" }}
                  containerStyle={{
                    height: 40,
                    width: width / 2.5,
                    marginLeft: 87,
                  }}
                  dropDownMaxHeight={90}
                  onChangeItem={(item) => {
                    setPickedVettura(item.label);
                  }}
                />
              </View>
              <View style={[styles.modalBody, { marginTop: "5%" }]}>
                <Text style={styles.modalText}>Team</Text>
                <DropDownPicker
                  items={listaTeam}
                  itemStyle={{ justifyContent: "flex-start" }}
                  placeholder="Seleziona un team"
                  placeholderStyle={{ justifyContent: "flex-start" }}
                  containerStyle={{
                    height: 40,
                    width: width / 2.5,
                    marginLeft: 100,
                  }}
                  dropDownMaxHeight={90}
                  onChangeItem={(item) => {
                    setPickedTeam(item.label);
                  }}
                />
              </View>
            </View>
            <View style={styles.modalBottom}>
              <Button
                title="Invia"
                buttonStyle={{
                  width: width / 3,
                }}
                type="outline"
                titleStyle={{ color: "#00BCD4", fontSize: 20 }}
                onPress={() => {
                  if (pickedTeam.length != 0 && pickedVettura.length != 0) {
                    sub_ToChamp(
                      route.params.campionato.id,
                      pickedTeam,
                      pickedVettura
                    ).then(() => {
                      setIsSub(true);
                      setIsVisible(false);
                      updateLocalCampionato(
                        route.params.campionato.id,
                        setNumeroPartecipanti
                      );
                      //navigation.goBack();
                    });
                  }
                }}
              ></Button>
            </View>
          </View>
        </Modal>
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
              Numero di partecipanti: {numero_partecipanti}
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
          {/* FINE TABELLA CON LE GARE */}
          <View style={{ marginVertical: "4%" }}>
            <Button
              buttonStyle={styles.buttonIscriviti}
              titleStyle={styles.buttonIscrivitiText}
              title={isSub ? "DISISCRIVITI" : "ISCRIVITI"}
              onPress={() => {
                if (!isSub) setIsVisible(true);
                else {
                  removeUtenteFromChamp(route.params.campionato.id).then(() => {
                    setIsSub(false);
                    updateLocalCampionato(
                      route.params.campionato.id,
                      setNumeroPartecipanti
                    );
                  });
                }
              }}
            ></Button>
          </View>
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
    marginTop: heigth > 800 ? "10%" : "5%",
  },
  modalButton: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00BCD4",
  },
});
