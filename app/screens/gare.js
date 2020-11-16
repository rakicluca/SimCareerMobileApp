import React, { useState } from "react";
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
  TouchableHighlight,
} from "react-native";
import { Button, ListItem, Avatar } from "react-native-elements";
import syncStorage from "sync-storage";
import config from "../config/config";
let width = Dimensions.get("screen").width;

function getMeteo(calendario, idGara) {
  let meteo = [];
  calendario.forEach((element) => {
    if (element.idCircuito == idGara) meteo.push(element.meteo);
  });
  return meteo;
}

function getGare(navigation, listaGare, calendario) {
  let [listCircuiti, setListCircuiti] = useState([]);
  React.useEffect(() => {
    let idList = [];
    listaGare.forEach((element) => {
      idList.push(element.idCircuito);
    }, []);
    //CHIAMATA DB
    async function getData() {
      await fetch(config.url.path + "/circuiti/getCircuiti", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listaGare: idList }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
          }
        })
        .then((response) => {
          setListCircuiti(...[response]);
        });
    }
    getData();
    //TODO CleanUp function
  }, []);
  let itemRender = ({ item, index }) => (
    <ListItem
      onPress={() => {
        syncStorage.set("gara", JSON.stringify(item));
        navigation.push("Gara", {
          campionato: JSON.parse(syncStorage.get("campionato")),
          gara: item,
          index: index,
        });
      }}
      Component={TouchableOpacity}
      bottomDivider
      containerStyle={{ backgroundColor: "rgba(51, 102, 255)" }}
    >
      <Avatar
        source={{ uri: item.url + "?rnd=" + Date.now() }}
        rounded
        size={120}
        avatarStyle={{ resizeMode: "contain" }}
      />
      <ListItem.Content>
        <ListItem.Title
          style={{
            alignSelf: "center",
            color: "white",
            marginBottom: 10,
            fontSize: 18,
          }}
        >
          {item.nome}
        </ListItem.Title>

        <Image
          source={{ uri: "http://openweathermap.org/img/wn/10d@2x.png" }}
          style={{
            width: 60,
            height: 60,
            resizeMode: "contain",
            alignSelf: "center",
          }}
        />
      </ListItem.Content>
      <ListItem.Title
        style={{ alignSelf: "center", color: "white", fontSize: 14 }}
      >
        {listaGare[index].data}
      </ListItem.Title>
    </ListItem>
  );
  return (
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={listCircuiti}
      renderItem={itemRender}
    ></FlatList>
  );
}

export default function Gare({ navigation, route }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(51, 102, 255, 0.6)",
      }}
    >
      {getGare(navigation, route.params.listaGare, route.params.calendario)}
    </View>
  );
}
const styles = StyleSheet.create({});
