import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Notifications from "expo-notifications";

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
import { Avatar, Button } from "react-native-elements";
import { ListItem } from "react-native-elements";
import config from "../config/config";
import Campionato from "./campionati.js";
import syncStorage from "sync-storage";
import Gara from "./gara";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import { ChampionshipsContext } from "../config/provider";
let listaPreferiti = new Array();

const ChampionStack = createStackNavigator();
const ChampionStackScreen = () => (
  <ChampionStack.Navigator headerMode={"none"}>
    <ChampionStack.Screen name="Home" component={HomeTabNavScreen} />
    <ChampionStack.Screen name="Campionato" component={Campionato} />
    <ChampionStack.Screen name="Gara" component={Gara} />
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
      style: { backgroundColor: "rgba(51, 102, 255, 1)" },
      inactiveTintColor: "rgba(255, 255, 255, 0.5)",
      activeTintColor: "white",
      indicatorStyle: { backgroundColor: "white" },
    }}
  >
    <HomeTabNav.Screen
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
  //const [listaCampionati, setListaCampionati] = React.useState([]);
  const [prefInDB, setprefInDB] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isSolid, setisSolid] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState([]);
  const [removePref, setRemovePref] = React.useState([]);
  const context = React.useContext(ChampionshipsContext);
  React.useEffect(() => {
    //Get Preferiti
    fetch(
      config.url.path +
        "/campionati/preferiti/" +
        syncStorage.get("utente").username,
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
          context.setListaCampionati(response);
        });
    }
    rememberMeOnLoad();
  }, []);

  let keyItemLista = (item, index) => index.toString();
  let itemRender = ({ item }) => (
    <ListItem
      Component={TouchableOpacity}
      onPress={() => {
        syncStorage.set("listagare", JSON.stringify(item.calendario));
        syncStorage.set("idCampionato", JSON.stringify(item.id));
        syncStorage.set("campionato", JSON.stringify(item));
        navigation.push("Campionato", { campionato: item });
      }}
      bottomDivider
      containerStyle={{ backgroundColor: "rgba(51, 102, 255)" }}
      style={{ backgroundColor: "rgba(51, 102, 255, 0.6)" }}
    >
      <Avatar rounded size={40} source={{ uri: item.logo }}></Avatar>
      <ListItem.Content>
        <ListItem.Title style={{ color: "white", fontFamily: "spyagencynorm" }}>
          {item.nome}
        </ListItem.Title>
      </ListItem.Content>
      <Icon
        size={25}
        name="star"
        color={"white"}
        style={{ justifyContent: "flex-end" }}
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
    </ListItem>
  );
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //Get Preferiti
    fetch(
      config.url.path +
        "/campionati/preferiti/" +
        syncStorage.get("utente").username,
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
        }
      })
      .then((response) => {
        setprefInDB(response);
      });
    try {
      let response = await fetch(config.url.path + "/campionati/");
      let responseJSON = await response.json();
      context.setListaCampionati(responseJSON);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);
  return (
    <FlatList
      renderItem={itemRender}
      data={context.listaCampionati}
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
    addPreferiti().then(async () => {
      try {
        await fetch(
          config.url.path +
            "/campionati/preferiti/" +
            syncStorage.get("utente").username,
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
    });
  }, [refreshing]);
  React.useEffect(() => {
    console.log("dentro use");
    fetch(
      config.url.path +
        "/campionati/preferiti/" +
        syncStorage.get("utente").username,
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
  }, []);
  let itemRender = ({ item, index }) => (
    <ListItem
      bottomDivider
      Component={TouchableOpacity}
      containerStyle={{
        backgroundColor: "rgba(51, 102, 255, 0.6)",
        height: 72.5,
      }}
      onPress={() => {
        navigation.push("Campionato", { campionato: item });
      }}
    >
      <Avatar rounded size={40} source={{ uri: item.logo }}></Avatar>
      <ListItem.Title style={{ color: "white", fontFamily: "spyagencynorm" }}>
        {item.nome}
      </ListItem.Title>
    </ListItem>
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

const addPreferiti = async () => {
  try {
    return fetch(
      config.url.path +
        "/campionati/preferiti/" +
        syncStorage.get("utente").username,
      {
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
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        console.log("status not 200");
      }
    });
  } catch (error) {
    console.error(error);
  }
};
export default function Home({ navigation }) {
  //this method will be called whenever a user interacts with a notification (eg. taps on it).
  Notifications.addNotificationResponseReceivedListener((response) => {
    switch (response.notification.request.content.data.type) {
      case "Campionato":
        {
          fetch(
            config.url.path +
              "/campionati/" +
              response.notification.request.content.data.id
          )
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              syncStorage.set("campionato", JSON.stringify(res));
              syncStorage.set("listagare", JSON.stringify(res.calendario));
              navigation.navigate("Campionato", { campionato: res });
              syncStorage.remove("NotificaData");
            });
        }
        break;
      case "GridGallery":
        {
          {
            fetch(
              config.url.path +
                "/campionati/" +
                response.notification.request.content.data.id
            )
              .then((res) => {
                return res.json();
              })
              .then((res) => {
                syncStorage.set("campionato", JSON.stringify(res));
                navigation.navigate("GridGallery", { items: res.foto });
                syncStorage.remove("NotificaData");
              });
          }
        }
        break;
    }
  });
  //Load custom font
  const [isLoaded] = useFonts({
    spyagencygrad: require("../../assets/fonts/SpyAgency/spyagency3grad.ttf"),
    spyagencynorm: require("../../assets/fonts/SpyAgency/spyagency3.ttf"),
    spyagencynormItal: require("../../assets/fonts/SpyAgency/spyagency3ital.ttf"),
    spyagencylaser: require("../../assets/fonts/SpyAgency/spyagency3laser.ttf"),
    spyagencyout: require("../../assets/fonts/SpyAgency/spyagency3out.ttf"),
    spyagencyexpand: require("../../assets/fonts/SpyAgency/spyagency3expand.ttf"),
    spyagency3d: require("../../assets/fonts/SpyAgency/spyagency33d.ttf"),
    spyagencycond: require("../../assets/fonts/SpyAgency/spyagency3cond.ttf"),
    spyagencycondItal: require("../../assets/fonts/SpyAgency/spyagency3condital.ttf"),
    spyagencycollege: require("../../assets/fonts/SpyAgency/spyagencyv3_2college.ttf"),
  });
  if (!isLoaded) {
    return <AppLoading />;
  } else {
    return <ChampionStackScreen />;
  }
}
