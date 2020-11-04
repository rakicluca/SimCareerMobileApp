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
} from "react-native";
import { Button, ListItem, Avatar } from "react-native-elements";
import config from "../config/config";
let width = Dimensions.get("screen").width;

function getGare(listaGare) {
  let [listCircuiti, setListCircuiti] = useState([]);
  React.useEffect(() => {
    let idList = [];
    listaGare.forEach((element) => {
      idList.push(element.idCircuito);
    });
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
        <ListItem.Title style={{ alignSelf: "center", color: "white" }}>
          {listaGare[index].data}
        </ListItem.Title>
        <ListItem.Subtitle style={{ alignSelf: "center", color: "white" }}>
          {item.meteo}
        </ListItem.Subtitle>
      </ListItem.Content>
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

export default function Gare({ route }) {
  return (
    <View
      style={{
        flex: 1,

        backgroundColor: "rgba(51, 102, 255, 0.6)",
      }}
    >
      {getGare(route.params.listaGare)}
      <View style={{ marginVertical: "4%" }}>
        <Button
          buttonStyle={styles.buttonIscriviti}
          titleStyle={styles.buttonIscrivitiText}
          title="ISCRIVITI"
        ></Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonIscriviti: {
    width: width / 3,
    backgroundColor: "white",
    alignSelf: "center",
  },
  buttonIscrivitiText: {
    color: "black",
  },
});
