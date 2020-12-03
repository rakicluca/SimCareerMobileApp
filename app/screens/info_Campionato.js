import React from "react";
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
  Linking,
} from "react-native";
import { Button } from "react-native-elements";
import { render } from "react-dom";

function convertToNiceString(listaAuto) {
  var tmp = [];
  listaAuto.forEach((element, index) => {
    if (listaAuto.length == 1 || index == listaAuto.length - 1)
      tmp.push(element);
    else tmp.push(element + ", ");
  });
  return tmp;
}

export default function Home({ route }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(51, 102, 255, 0.6)",
        paddingHorizontal: "2%",
        alignItems: "center",
      }}
    >
      <View style={styles.infoCampionato}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
          Informazioni campionato
        </Text>
      </View>
      {route.params.campionato.impostazioni_gioco.map((infoText, key) => {
        return (
          <View
            key={key}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View>
              <Text key={key} style={styles.testo}>
                {infoText.tipo}:{" "}
              </Text>
            </View>
            <View>
              <Text key={key + 1} style={styles.testoValore}>
                {infoText.valore}
              </Text>
            </View>
          </View>
        );
      })}

      <View style={styles.listaAuto}>
        <View style={styles.listaAutoText}>
          <Text style={styles.testo}>Lista auto:</Text>
        </View>
        <View style={styles.listaAutoValore}>
          <Text style={styles.testoValore}>
            {convertToNiceString(route.params.campionato.lista_auto)}
          </Text>
        </View>
      </View>
      <View style={styles.forumLink}>
        <Text style={styles.testo}>Link forum campionato:</Text>
        <Text
          style={styles.urlStyle}
          onPress={() => Linking.openURL("http://www.simcareer.org/forum/")}
        >
          http://www.simcareer.org/forum/
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  testo: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  testoValore: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
  },
  urlStyle: {
    color: "blue",
    marginVertical: "3%",
    textDecorationLine: "underline",
    fontSize: 15,
  },
  forumLink: {
    marginVertical: "5%",
  },
  listaAuto: {
    marginVertical: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoCampionato: { marginTop: "5%" },
});
