import React from "react";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import { useForm, Controller } from "react-hook-form";
import { CommonActions } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
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
} from "react-native";
import { Button } from "react-native-elements";
import { render } from "react-dom";
import { ListItem } from "react-native-elements";

const HomeTabNav = createMaterialTopTabNavigator();
const HomeTabNavScreen = () => (
  <HomeTabNav.Navigator
    tabBarPosition="top"
    tabBarOptions={{ showLabel: "true", style: { height: 100, width: 100 } }}
  >
    <HomeTabNav.Screen
      name="Campionati"
      component={getAllcampionati}
    ></HomeTabNav.Screen>
  </HomeTabNav.Navigator>
);

const getAllcampionati = ({ navigation }) => {
  const [listaCampionati, setListaCampionati] = React.useState([]);
  React.useEffect(() => {
    function rememberMeOnLoad() {
      fetch("http://192.168.1.7:3000/campionati/", {
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
  const list = [
    {
      id: "1",
      name: "Leon supercoppa 2019",
      subtitle: "Piccola descrizione",
    },
    {
      id: "2",
      name: "Leon 2019",
      subtitle: "Piccola descrizione",
    },
  ];
  pluto = ({ item }) => (
    <ListItem
      title={item.nome}
      //onPress={}
    />
  );
  pippo = (item, index) => index.toString();
  console.log(listaCampionati);
  return (
    <FlatList renderItem={pluto} data={listaCampionati} keyExtractor={pippo} />
  );
};

function getCampionati() {}

export default function Home() {
  return <HomeTabNavScreen />;
}
