import config from "../config/config";
import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Avatar, Image, ListItem } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

function getCampionatiByUtente(setListaCampionati) {
  async function getData() {
    await fetch(config.url.path + "/campionati/champStarted/all")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
        }
      })
      .then((response) => {
        setListaCampionati(response);
      })
      .catch((err) => {
        console.info(err);
      });
  }
  getData();
}

export default function Gallery({ navigation, route }) {
  const [listaCampionati, setListaCampionati] = React.useState([]);

  React.useEffect(() => {
    getCampionatiByUtente(setListaCampionati);
  }, []);

  let itemRender = ({ item }) => (
    <ListItem
      Component={TouchableOpacity}
      onPress={() => {
        navigation.push("GridGallery", { items: item.foto });
      }}
      bottomDivider
      containerStyle={{ backgroundColor: "rgba(51, 102, 255,0.5)" }}
      style={{ backgroundColor: "rgba(51, 102, 255, 0.5)" }}
    >
      <Avatar rounded size={40} source={{ uri: item.logo }}></Avatar>
      <ListItem.Content>
        <ListItem.Title style={{ color: "white" }}>{item.nome}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        renderItem={itemRender}
        data={listaCampionati}
        keyExtractor={(item, index) => index.toString()}
        style={{
          backgroundColor: "rgba(51, 102, 255, 0.6)",
        }}
      />
    </SafeAreaView>
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
});
