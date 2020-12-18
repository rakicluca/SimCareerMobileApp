import config from "../config/config";
import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Avatar, Icon, Image, ListItem } from "react-native-elements";
import syncStorage from "sync-storage";

function getCampionatiByUtente(setListaCampionati) {
  async function getData() {
    await fetch(
      config.url.path +
        "/classifiche/bestResult/" +
        syncStorage.get("utente").id
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
        }
      })
      .then((response) => {
        //console.log(response);
        setListaCampionati(...[response]);
      })
      .catch((err) => {
        console.info(err);
      });
  }
  getData();
}

export default function myBestResult({ navigation, route }) {
  const [listaCampionati, setListaCampionati] = React.useState([]);
  React.useEffect(() => {
    getCampionatiByUtente(setListaCampionati);
    //console.log(listaCampionati);
  }, []);

  let itemRender = ({ item }) => (
    <ListItem
      Component={TouchableOpacity}
      onPress={() => {
        navigation.navigate("Campionati", { campionato: item });
      }}
      bottomDivider
      containerStyle={{ backgroundColor: "rgba(51, 102, 255)" }}
      style={{ backgroundColor: "rgba(51, 102, 255, 0.6)" }}
    >
      <Avatar rounded size={40} source={{ uri: item.logo }}></Avatar>
      <ListItem.Content>
        <ListItem.Title style={styles.testoTitle}>{item.nome}</ListItem.Title>
      </ListItem.Content>
      <Icon name="trophy" type="font-awesome" color={item.color}></Icon>
      <ListItem.Chevron size={22} />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <FlatList
        renderItem={itemRender}
        data={listaCampionati}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(51, 102, 255,0.6)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  testoTitle: {
    color: "white",
    fontFamily: "spyagencycond",
    fontSize: 17,
  },
});
