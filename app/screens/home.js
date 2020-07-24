import React from "react";
import { useForm, Controller } from "react-hook-form";
import { CommonActions } from "@react-navigation/native";
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
import { it } from "date-fns/locale";

let listaPreferiti = new Array();
let respPref = new Array();

const HomeTabNav = createMaterialTopTabNavigator();
const HomeTabNavScreen = () => (
  <HomeTabNav.Navigator
    lazy={true}
    tabBarPosition="top"
    initialRouteName="Campionati"
    initialLayout={{ width: Dimensions.get("window").width }}
    tabBarOptions={{ showIcon: true, showLabel: "true" }}
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
  const [refreshing, setRefreshing] = React.useState(false);
  const [isSolid, setisSolid] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState([]);
  React.useEffect(() => {
    function rememberMeOnLoad() {
      fetch("http://192.168.1.18:3000/campionati/", {
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
      //onPress={}
      rightIcon={
        <Icon
          size={30}
          name="star"
          color={"black"}
          //Solid=true stellina piena
          //Solid=false stellina vuota
          solid={isSelected.includes(item.id) ? true : false}
          onPress={() => {
            //listaPreferiti.push(item.id);
            /*React.useEffect(() => {
              let index = isSelected.indexOf(item.id);
            if (!isSelected.includes(item.id)) {
              console.log("includes onPress");
              setIsSelected(previsSelected => ([...previsSelected, ...isSelected]));
              console.log("Id added: " + isSelected);
            } else setIsSelected(isSelected.splice(index, 1));
            console.log(isSelected);
            console.log(isSelected.includes(item.id));
            console.log("Item id: " + item.id);
          }, [isSelected]);*/
          console.log("Item id:"+item.id);
          if(isSelected.includes(item.id)){
            console.log("esiste già");
            isSelected.splice(isSelected.indexOf(item.id),1);
            setIsSelected([...isSelected,isSelected]);
            console.log("Array splice: "+isSelected);
          }else
          setIsSelected([...isSelected,item.id]);
          //setIsSelected(previsSelected => ([...previsSelected, ...isSelected]));
          console.log(isSelected);
          }}
        ></Icon>
      }
    />
  );
  /*  const checkIsSelected = (item) => {
    console.log("dentro check ");
     let tmp = isSelecetd;
    let selected = false;
    if (tmp.includes(item.id)) selected = true;
    return selected; 
  };
  const addToIsSelected = (item) => {
    console.log("dentro");
    let tmp = isSelecetd;
    let index = tmp.indexOf(item.id);
    if (!tmp.includes(item.id)) tmp.push(item.id);
    else tmp.splice(index, 1);
    console.log(tmp);
    setIsSelected(tmp);
  }; */

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      let response = await fetch("http://192.168.1.18:3000/campionati/");
      let responseJSON = await response.json();
      console.log(responseJSON);
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const getPreferiti = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //Add Preferiti
    addPreferiti();
    //Get Preferiti
    try {
      let response = await fetch(
        "http://192.168.1.18:3000/campionati/preferiti/" + global.username,
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
          respPref = response;
        });
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [refreshing]);
  let itemRender = ({ item }) => (
    <ListItem
      title={item}
      //onPress={}
    />
  );
  let keyItemLista = (item, index) => index.toString();
  return (
    <FlatList
      renderItem={itemRender}
      data={respPref}
      keyExtractor={keyItemLista}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const addPreferiti = () => {
  try {
    fetch("http://192.168.1.18:3000/campionati/preferiti/" + global.username, {
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

export default function Home() {
  return <HomeTabNavScreen />;
}
