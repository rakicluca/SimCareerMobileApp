import React from "react";
import { useForm, Controller } from "react-hook-form";
import { CommonActions } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";
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
  FlatList,
  RefreshControl,
} from "react-native";
import { Button } from "react-native-elements";
import { render } from "react-dom";
import { ListItem } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { it, is } from "date-fns/locale";
import config from "../config/config";
import Campionati from "./campionati.js";
import syncStorage from "sync-storage";
let listaPreferiti = new Array();

const ChampionStack = createStackNavigator();
const ChampionStackScreen = () => (
  <ChampionStack.Navigator headerMode={"none"}>
    <ChampionStack.Screen name="Home" component={HomeTabNavScreen} />
    <ChampionStack.Screen name="Campionati" component={Campionati} />
    {/* <ChampionStack.Screen name="Gare" component={Gare} /> */}
  </ChampionStack.Navigator>
);

const HomeTabNav = createMaterialTopTabNavigator();
const HomeTabNavScreen = () => (
  <HomeTabNav.Navigator
    lazy={true}
    tabBarPosition="top"
    initialRouteName="Campionati"
    initialLayout={{ width: Dimensions.get("window").width }}
    tabBarOptions={{
      showIcon: true,
      showLabel: "true",
      style: { paddingTop: 30, backgroundColor: "rgba(51, 102, 255, 1)" },
      inactiveTintColor: "rgba(255, 255, 255, 0.5)",
      activeTintColor: "white",
      indicatorStyle: { backgroundColor: "white" },
    }}
  >
    <HomeTabNav.Screen
      onswipe
      name="Campionati"
      component={getAllcampionati}
    ></HomeTabNav.Screen>
    <HomeTabNav.Screen
      name="Preferiti"
      component={getPreferiti}
    ></HomeTabNav.Screen>
  </HomeTabNav.Navigator>
);

const getAllcampionati = ({ navigation }) => {
  const [listaCampionati, setListaCampionati] = React.useState([]);
  const [prefInDB, setprefInDB] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isSolid, setisSolid] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState([]);
  const [removePref, setRemovePref] = React.useState([]);
  React.useEffect(() => {
    //Get Preferiti
    fetch(config.url.path + "/campionati/preferiti/" + global.username, {
      method: "PUT",
      dataType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
        }
      })
      .then((response) => {
        let tmp = [];
        if (response != null)
          response.forEach((element) => {
            tmp.push(element.id);
            listaPreferiti.push(element.id);
          });
        setIsSelected(...isSelected, tmp);
      });

    function rememberMeOnLoad() {
      fetch(config.url.path + "/campionati/", {
        method: "GET",
        dataType: "json",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
          }
        })
        .then((response) => {
          setListaCampionati(response);
        });
    }
    rememberMeOnLoad();
  }, []);

  let keyItemLista = (item, index) => index.toString();
  let itemRender = ({ item }) => (
    <ListItem
      title={item.nome}
      onPress={() => {
        syncStorage.set("listagare", JSON.stringify(item.calendario));
        navigation.push("Campionati", { campionato: item });
      }}
      bottomDivider
      containerStyle={{ backgroundColor: "rgba(51, 102, 255)" }}
      titleStyle={{ color: "white" }}
      leftAvatar={{
        source: { uri: item.logo },
      }}
      rightIcon={
        <Icon
          size={30}
          name="star"
          color={"white"}
          //Solid=true stellina piena
          //Solid=false stellina vuota
          solid={isSelected.includes(item.id) ? true : false}
          onPress={() => {
            if (!listaPreferiti.includes(item.id)) listaPreferiti.push(item.id);
            else listaPreferiti.splice(listaPreferiti.indexOf(item.id), 1);
            console.log(listaPreferiti);
            if (isSelected.includes(item.id)) {
              isSelected.splice(isSelected.indexOf(item.id), 1);
              setIsSelected([...isSelected, isSelected]);
            } else setIsSelected([...isSelected, item.id]);
          }}
        ></Icon>
      }
      style={{ backgroundColor: "rgba(51, 102, 255, 0.6)" }}
    />
  );
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //Get Preferiti
    fetch(config.url.path + "/campionati/preferiti/" + global.username, {
      method: "PUT",
      dataType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
        }
      })
      .then((response) => {
        setprefInDB(response);
      });
    try {
      let response = await fetch(config.url.path + "/campionati/");
      let responseJSON = await response.json();
      setListaCampionati(responseJSON);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);
  return (
    <FlatList
      renderItem={itemRender}
      data={listaCampionati}
      keyExtractor={keyItemLista}
      style={{
        backgroundColor: "rgba(51, 102, 255, 0.6)",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const getPreferiti = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [respPref, setrespPref] = React.useState([]);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //Add Preferiti
    addPreferiti();
    //Get Preferiti
    try {
      let response = await fetch(
        config.url.path + "/campionati/preferiti/" + global.username,
        {
          method: "PUT",
          dataType: "json",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            console.error("status not 200");
          }
        })
        .then((response) => {
          setrespPref(response);
        });
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);
  let itemRender = ({ item, index }) => (
    <ListItem
      title={item.nome}
      bottomDivider
      containerStyle={{
        backgroundColor: "rgba(51, 102, 255, 0.6)",
        height: 72.5,
      }}
      titleStyle={{ color: "white" }}
      onPress={() => {
        navigation.push("Campionati", { campionato: item });
      }}
    />
  );
  let keyItemLista = (item, index) => index.toString();
  return (
    <FlatList
      renderItem={itemRender}
      data={respPref}
      extraData={respPref}
      keyExtractor={keyItemLista}
      style={{
        backgroundColor: "rgba(51, 102, 255, 0.6)",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const addPreferiti = () => {
  try {
    fetch(config.url.path + "/campionati/preferiti/" + global.username, {
      method: "POST",
      dataType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          campionati_preferiti: listaPreferiti,
        },
      ]),
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log("status not 200");
      }
    });
    console.log(listaPreferiti);
  } catch (error) {
    console.error(error);
  }
};

export default function Home({ navigation }) {
  return <ChampionStackScreen />;
}
