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

function convertToNiceString(listaAuto) {
  var tmp = [];
  listaAuto.forEach((element, index) => {
    if (listaAuto.length == 1 || index == listaAuto.length - 1)
      tmp.push(element);
    else tmp.push(element + ", ");
  });
  return tmp;
}

function getMeteo(calendario, idGara) {
  let meteo = [];
  calendario.forEach((element) => {
    if (element.idCircuito == idGara) meteo.push(element.meteo);
  });
  return (
    <>
      <View style={styles.garaText}>
        <Text style={styles.testo}>Previsione: </Text>
        <Text style={styles.testoValore}>
          {meteo[0].weather[0].description}
        </Text>
      </View>
      <View style={styles.garaText}>
        <Text style={styles.testo}>Temperatura min: </Text>
        <Text style={styles.testoValore}>
          {meteo[0].temp.min}
          {"°C"}
        </Text>
      </View>
      <View style={styles.garaText}>
        <Text style={styles.testo}>Temperatura max: </Text>
        <Text style={styles.testoValore}>
          {meteo[0].temp.max}
          {"°C"}
        </Text>
      </View>
      <View style={styles.garaText}>
        <Text style={styles.testo}>Umidità: </Text>
        <Text style={styles.testoValore}>
          {meteo[0].humidity}
          {"%"}
        </Text>
      </View>
      <View style={styles.garaText}>
        <Text style={styles.testo}>Velocità del vento: </Text>
        <Text style={styles.testoValore}>
          {meteo[0].wind_speed}
          {" m/s"}
        </Text>
      </View>
      <View style={styles.garaText}>
        <Text style={styles.testo}>Pioggia: </Text>
        <Text style={styles.testoValore}>
          {meteo[0].rain == undefined ? 0 : meteo[0].rain}
          {" mm"}
        </Text>
      </View>
    </>
  );
}

export default function infoGara({ route }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(51, 102, 255, 0.6)",
        paddingHorizontal: "2%",
        alignItems: "center",
      }}
    >
      <View style={styles.infoGara}>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
          Informazioni gara
        </Text>
      </View>
      <View style={styles.infoGaraText}>
        <View style={styles.garaText}>
          <Text style={styles.testo}>Lunghezza circuito:</Text>
          <Text style={styles.testoValore}> {route.params.gara.km} km</Text>
        </View>
        <View style={styles.infoMeteo}>
          <Text style={styles.meteoTitle}>Meteo</Text>
          {getMeteo(
            route.params.campionato.calendario,
            route.params.gara.idCircuito
          )}
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
    alignSelf: "center",
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
  infoGara: { marginTop: "5%" },
  infoGaraText: { justifyContent: "center", alignItems: "center" },
  infoMeteo: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
    flexDirection: "column",
  },
  garaText: {
    flexDirection: "row",
  },
  meteoTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
