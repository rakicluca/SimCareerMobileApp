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
import DropDownPicker from "react-native-dropdown-picker";
import { Button, ListItem, Avatar } from "react-native-elements";
import config from "../config/config";
let width = Dimensions.get("screen").width;

function getGare(navigation, idCampionato, filter, setClassificaChamp) {
  //CHIAMATA DB
  async function getData() {
    if (filter == 0) {
      await fetch(config.url.path + "/classifiche/" + idCampionato)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
          }
        })
        .then((response) => {
          let array_ordinato = response.classifica_piloti.sort(function (a, b) {
            return b.punti - a.punti;
          });
          setClassificaChamp(...[array_ordinato]);
        })
        .catch((err) => {
          console.info("Errore filter 0: " + err);
        });
    } else {
      await fetch(config.url.path + "/classifiche/" + idCampionato)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
          }
        })
        .then((response) => {
          let array_ordinato = response.classifica_team.sort(function (a, b) {
            return b.punti - a.punti;
          });
          setClassificaChamp(...[array_ordinato]);
        })
        .catch((err) => {
          console.error("Errore filter 1: " + err);
        });
    }
  }
  getData();
}

function setPosizione(index) {
  let posizione;
  switch (index + 1) {
    case 1:
      posizione = (
        <ListItem.Title
          style={{
            color: "#C9B037",
            fontSize: 35,
            fontFamily: "spyagencyexpand",
          }}
        >
          {index + 1}
        </ListItem.Title>
      );
      break;
    case 2:
      posizione = (
        <ListItem.Title
          style={{
            color: "#B4B4B4",
            fontSize: 20,
            fontFamily: "spyagencyexpand",
          }}
        >
          {index + 1}
        </ListItem.Title>
      );
      break;
    case 3:
      posizione = (
        <ListItem.Title
          style={{
            color: "#AD8A56",
            fontSize: 20,
            fontFamily: "spyagencyexpand",
          }}
        >
          {index + 1}
        </ListItem.Title>
      );
      break;
    default:
      posizione = (
        <ListItem.Title
          style={[
            styles.testo,
            { marginRight: "1.5%", fontFamily: "spyagencyexpand" },
          ]}
        >
          {index + 1}
        </ListItem.Title>
      );
  }
  return posizione;
}
function renderItem(filter, classificaChamp) {
  if (filter == 0) {
    let itemRenderPiloti = ({ item, index }) => (
      //Lista Piloti
      <ListItem
        //onPress={() => navigation.push("Pilota")}
        Component={TouchableOpacity}
        bottomDivider
        containerStyle={{ backgroundColor: "rgba(51, 102, 255)" }}
      >
        {setPosizione(index)}

        <Avatar
          source={{
            uri: config.url.path + "/img/work_in_progress.jpg",
          }}
          size={45}
          rounded
          avatarStyle={{ resizeMode: "cover" }}
        ></Avatar>
        <ListItem.Content>
          <ListItem.Title style={styles.testoTitle}>{item.nome}</ListItem.Title>
          <ListItem.Subtitle style={styles.testoSubtitle}>
            {item.team}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title style={[styles.testoPunti]}>
          {item.punti}
        </ListItem.Title>
      </ListItem>
    );
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={classificaChamp}
        renderItem={itemRenderPiloti}
      ></FlatList>
    );
  } else {
    let itemRenderTeam = (
      { item, index } //Lista Team
    ) => (
      <ListItem
        //onPress={() => navigation.push("Team")}
        Component={TouchableOpacity}
        bottomDivider
        containerStyle={{ backgroundColor: "rgba(51, 102, 255)" }}
      >
        {setPosizione(index)}

        <Avatar
          source={{
            uri: config.url.path + "/img/work_in_progress.jpg",
          }}
          size={45}
          rounded
          avatarStyle={{ resizeMode: "cover" }}
        ></Avatar>
        <ListItem.Content>
          <ListItem.Title style={styles.testoTitle}>{item.team}</ListItem.Title>
          <ListItem.Subtitle style={styles.testoSubtitle}>
            {item.auto}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title style={[styles.testoPunti]}>
          {item.punti}
        </ListItem.Title>
      </ListItem>
    );
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={classificaChamp}
        renderItem={itemRenderTeam}
      ></FlatList>
    );
  }
}

export default function classiche_Campionati({ navigation, route }) {
  const [filter, setFilter] = useState(0);
  const [classificaChamp, setClassificaChamp] = useState([]);
  React.useEffect(() => {
    getGare(navigation, route.params.idCampionato, filter, setClassificaChamp);
  }, [filter]);

  return (
    <View
      style={{
        flex: 1,

        backgroundColor: "rgba(51, 102, 255, 0.6)",
      }}
    >
      <View style={{ alignItems: "center", marginTop: "5%" }}>
        <DropDownPicker
          items={[
            { label: "Piloti", value: 0, selected: true },
            { label: "Team", value: 1 },
          ]}
          defaultValue={0}
          containerStyle={{ height: 40, width: width / 4 }}
          onChangeItem={(item) => {
            setFilter(item.value);
            getGare(
              navigation,
              route.params.idCampionato,
              filter,
              setClassificaChamp
            );
          }}
        />
      </View>

      {renderItem(filter, classificaChamp)}
    </View>
  );
}
const styles = StyleSheet.create({
  testo: {
    color: "white",
  },
  testoSubtitle: {
    color: "white",
    fontSize: 12,
  },
  testoTitle: {
    color: "white",
    fontFamily: "spyagencycond",
    fontSize: 17,
  },
  testoPunti: {
    color: "white",
    fontFamily: "spyagencynorm",
  },
  spacing: {
    marginTop: "3%",
  },
});
