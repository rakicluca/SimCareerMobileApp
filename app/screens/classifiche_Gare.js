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
import config from "../config/config";
let width = Dimensions.get("screen").width;

function getGare(navigation, idCampionato, idGara, setClassificaGare) {
  //CHIAMATA DB
  async function getData() {
    await fetch(config.url.path + "/campionati/" + idCampionato)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
        }
      })
      .then((response) => {
        let array = [];
        response.piloti_iscritti.forEach((element) => {
          element.tempi.forEach((item) => {
            if (item.idGara == idGara)
              array.push({
                nome: element.nome,
                tempo: item.tempo,
                team: element.team,
                auto: element.auto,
                posizione: item.posizione,
              });
          });
        });
        let array_ordinato = array.sort(function (a, b) {
          return a.posizione - b.posizione;
        });
        setClassificaGare(...[array_ordinato]);
      })
      .catch((err) => {
        console.info(err);
      });
  }
  getData();
}

export default function Classifiche_Gare({ navigation, route }) {
  const [classificaGare, setClassificaGare] = useState([]);
  let itemRenderPiloti = ({ item, index }) => (
    //Lista Piloti
    <ListItem
      //onPress={() => navigation.push("Pilota")}
      Component={TouchableOpacity}
      bottomDivider
      containerStyle={{ backgroundColor: "rgba(51, 102, 255)" }}
    >
      <Avatar
        source={{
          uri: config.url.path + "/img/work_in_progress.jpg",
        }}
        size={45}
        rounded
        avatarStyle={{ resizeMode: "cover" }}
      ></Avatar>
      <ListItem.Content>
        <ListItem.Title style={styles.testo}>{item.nome}</ListItem.Title>
        <ListItem.Subtitle style={[styles.testo, { fontSize: 12 }]}>
          {item.team}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Title style={[styles.testo]}>{item.tempo}</ListItem.Title>
    </ListItem>
  );
  React.useEffect(() => {
    getGare(
      navigation,
      route.params.idCampionato,
      route.params.idGara,
      setClassificaGare
    );
  }, []);

  return (
    <View
      style={{
        flex: 1,

        backgroundColor: "rgba(51, 102, 255, 0.6)",
      }}
    >
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={classificaGare}
        renderItem={itemRenderPiloti}
      ></FlatList>
    </View>
  );
}
const styles = StyleSheet.create({
  testo: {
    color: "white",
  },
  spacing: {
    marginTop: "3%",
  },
});
