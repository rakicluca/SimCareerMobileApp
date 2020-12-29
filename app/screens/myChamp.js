import config from "../config/config";
import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Avatar, Icon, Image, ListItem } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import syncStorage from "sync-storage";
import { ChampionshipsContext } from "../config/provider";
import { Text } from "react-native";
import { StatusBar } from "react-native";

function getCampionatiByUtente(context) {
  async function getData() {
    await fetch(
      config.url.path + "/campionati/myChamp/" + syncStorage.get("utente").id
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          console.log("else");
        }
      })
      .then((response) => {
        //console.log(response);
        context.setmyListaCampionati(...[response]);
      })
      .catch((err) => {
        console.info(err);
      });
  }
  getData();
}

const EmptyList = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon
        name="trophy"
        type="evilicon"
        size={150}
        color="white"
        style={{ opacity: 0.65 }}
      ></Icon>

      <Text style={styles.empty}>
        Sembra che tu non abbia partecipato a nessun campionato!
      </Text>
      <Text style={styles.empty}>
        Corri a scoprire i campionati disponibili
      </Text>
    </View>
  );
};

export default function myChamp({ navigation, route }) {
  //const [listaCampionati, setListaCampionati] = React.useState([]);
  const context = React.useContext(ChampionshipsContext);
  React.useEffect(() => {
    getCampionatiByUtente(context);
    //console.log(listaCampionati);
  }, []);

  let itemRender = ({ item }) => (
    <ListItem
      Component={TouchableOpacity}
      onPress={() => {
        navigation.navigate("Campionato", { campionato: item });
      }}
      bottomDivider
      containerStyle={{ backgroundColor: "rgba(51, 102, 255,0.6)" }}
      style={{ backgroundColor: "rgba(51, 102, 255, 0.45)" }}
    >
      <Avatar rounded size={40} source={{ uri: item.logo }}></Avatar>
      <ListItem.Content>
        <ListItem.Title style={styles.testoTitle}>{item.nome}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron size={22} />
    </ListItem>
  );

  return (
    <SafeAreaView style={styles.container}>
      {context.myListaCampionati.length != 0 ? (
        <FlatList
          renderItem={itemRender}
          data={context.myListaCampionati}
          keyExtractor={(item, index) => index.toString()}
          style={{
            backgroundColor: "rgba(51, 102, 255, 0.6)",
          }}
        />
      ) : (
        <EmptyList />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  empty: {
    opacity: 0.6,
    color: "white",
    fontStyle: "italic",
  },
});
