import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
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
  SafeAreaView,
} from "react-native";
import InfoGara from "./info_Gara";
import ClassificaGara from "./classifiche_Gare";
import syncStorage from "sync-storage";
import { Controller, useForm } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button } from "react-native-elements";

let width = Dimensions.get("screen").width;
let height = Dimensions.get("screen").height;

function getData(dataName) {
  let data = syncStorage.get(dataName);
  return JSON.parse(data);
}

const InfoUtente = () => {
  const { control, errors, handleSubmit, getValues, setValue } = useForm();
  const [datePickerState, setDatePickerState] = React.useState({
    visibility: false,
    dateDisplay: "",
  });
  //OnSubmit Form
  const onSubmit = (data) => {
    try {
      fetch(config.url.path + "/utenti/", {
        method: "POST",
        dataType: "json",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            id: 0,
            username: data.username,
            email: data.email,
            password: data.password,
            nome: data.nome,
            cognome: data.cognome,
            data_nascita: data.data,
            residenza: data.residenza,
            imgUtente: "img/linkToDirectory",
            numero_in_gara_preferito: 0,
            id_numero_circuito_preferito: 0,
            id_numero_circuito_odiato: 0,
            id_auto_preferita: 0,
          },
        ]),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.log(error);
    }
  };
  //Handle Confirm for DatePicker
  const format = require("date-fns/format");
  let handleConfirm = (date) => {
    setDatePickerState({
      dateDisplay: format(date, "dd/MM/yyyy"),
    });
    setValue("data", format(date, "dd/MM/yyyy"));
  };
  let onPressCancel = () => {
    setDatePickerState({ visibility: false });
    setValue("data", "");
  };
  let onPresstextInput = () => {
    setDatePickerState({ visibility: true });
  };
  function cleanUpDatePickerState() {
    return setDatePickerState({ visibility: false, dateDisplay: "" });
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: "rgba(51, 102, 255,0.5)", flex: 1 }}
    >
      <ScrollView pagingEnabled={true} scrollEventThrottle={16}>
        <View style={styles.regform}>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.textinput}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Inserisci il tuo username"
                underlineColorAndroid={"transparent"}
              />
            )}
            name="username"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.username && (
            <Text style={styles.errorText}>Campo richiesto</Text>
          )}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.textinput}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Inserisci la tua email"
                underlineColorAndroid={"transparent"}
              />
            )}
            name="email"
            rules={{
              required: { value: true, message: "Campo richiesto" },
              pattern: {
                value: /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Email non valida",
              },
            }}
            defaultValue=""
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.textinput}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Inserisci la tua password"
                underlineColorAndroid={"transparent"}
                secureTextEntry={true}
              />
            )}
            name="password"
            rules={{
              required: { value: true, message: "Campo richiesto" },
              minLength: {
                value: 8,
                message: "Troppo corta! Almeno 8 caratteri",
              },
            }}
            defaultValue=""
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              style={styles.textinput}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              placeholder="Inserisci il tuo nome"
              underlineColorAndroid={"transparent"}
            />
          )}
          name="nome"
          rules={{
            required: { value: true, message: "Campo richiesto" },
            validate: (value) =>
              value.match(/[0-9!/"£$%&()=?^@#§*]/) == null ||
              "Numeri e caratteri speciali non ammessi",
          }}
          defaultValue=""
        />
        {errors.nome && (
          <Text style={styles.errorText}>{errors.nome.message}</Text>
        )}
        <Controller
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              style={styles.textinput}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={styles.textinput}
              placeholder="Inserisci il tuo cognome"
              underlineColorAndroid={"transparent"}
            />
          )}
          name="cognome"
          rules={{
            required: { value: true, message: "Campo richiesto" },
            validate: (value) =>
              value.match(/[0-9!/"£$%&()=?^@#§*]/) == null ||
              "Numeri e caratteri speciali non ammessi",
          }}
          defaultValue=""
        />
        {errors.cognome && (
          <Text style={styles.errorText}>{errors.cognome.message}</Text>
        )}
        <Controller
          control={control}
          render={({ onChange, onBlur, dateDisplay }) => (
            <TouchableOpacity onPress={() => onPresstextInput()}>
              <TextInput
                style={styles.textinput}
                placeholder="GG/MM/YYYY"
                underlineColorAndroid={"transparent"}
                editable={false}
                value={datePickerState.dateDisplay}
                onBlur={onBlur}
                onChangeText={(dateDisplay) => onChange(dateDisplay)}
              ></TextInput>
            </TouchableOpacity>
          )}
          name="data"
          rules={{
            required: { value: true, message: "Campo richiesto" },
          }}
          defaultValue=""
        />
        {errors.data && (
          <Text style={styles.errorText}>{errors.data.message}</Text>
        )}
        <DateTimePickerModal
          isVisible={datePickerState.visibility}
          onConfirm={handleConfirm}
          onCancel={onPressCancel}
          mode="date"
          maximumDate={new Date()}
          locale="it-IT"
        ></DateTimePickerModal>
        <Controller
          control={control}
          render={({ onChange, onBlur, dateDisplay }) => (
            <TextInput
              style={styles.textinput}
              underlineColorAndroid={"transparent"}
              onBlur={onBlur}
              placeholder="Inserisci la tua residenza"
              onChangeText={(dateDisplay) => onChange(dateDisplay)}
              underlineColorAndroid={"transparent"}
            ></TextInput>
          )}
          name="residenza"
          rules={{
            required: { value: true, message: "Campo richiesto" },
          }}
          defaultValue=""
        />
        {errors.residenza && (
          <Text style={styles.errorText}>{errors.residenza.message}</Text>
        )}
        <View style={styles.buttonRegistrati}>
          <Button
            title={"Salva"}
            titleStyle={{ fontFamily: "spyagencynorm", fontSize: 16 }}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const BestResult = () => {
  return (
    <View style={{ backgroundColor: "rgba(51, 102, 255,0.5)", flex: 1 }}>
      <Text>B</Text>
    </View>
  );
};

const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator headerMode={"none"}>
    {/* <RaceStack.Screen name="Home" component={HomeTabNavScreen} /> */}
    <ProfileStack.Screen name="BestResultUtente" component={BestResult} />
    <ProfileStack.Screen name="Info" component={InfoUtente} />
  </ProfileStack.Navigator>
);
const ProfileTabNav = createMaterialTopTabNavigator();
const ProfileTabNavScreen = () => (
  <ProfileTabNav.Navigator
    lazy={true}
    tabBarPosition="top"
    initialRouteName="Info"
    initialLayout={{ width: Dimensions.get("window").width }}
    tabBarOptions={{
      showLabel: true,
      style: { paddingTop: 5, backgroundColor: "rgba(51, 102, 255, 1)" },
      inactiveTintColor: "rgba(255, 255, 255, 0.5)",
      activeTintColor: "white",
      indicatorStyle: { backgroundColor: "white" },
      labelStyle: {
        fontFamily: "spyagencynorm",
      },
    }}
    backBehavior={"order"}
  >
    <ProfileTabNav.Screen
      name="Info"
      component={InfoUtente}
      /*       initialParams={{
        idCampionato: getData("idCampionato"),
        idGara: getData("gara").idCircuito,
      }} */
    ></ProfileTabNav.Screen>
    <ProfileTabNav.Screen
      onswipe
      name="My Best"
      component={BestResult}
      /*       initialParams={{
        gara: getData("gara"),
        campionato: getData("campionato"),
      }} */
    ></ProfileTabNav.Screen>
  </ProfileTabNav.Navigator>
);

export default function Profile() {
  let utente = syncStorage.get("utente");
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(51, 102, 255, 0.6)" }}>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          marginTop: "10%",
        }}
      >
        <View
          style={{
            marginHorizontal: "3%",
            justifyContent: "center",
            alignSelf: "center",
            backgroundColor: "white",
            borderRadius: 170,
          }}
        >
          <Image
            style={{
              width: 180,
              height: 180,
              borderRadius: 190 / 2,
              resizeMode: "contain",
            }}
            source={{
              uri: utente.imgUtente,
            }}
          ></Image>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.usernameUtente}>{utente.username}</Text>
          <View style={styles.infoUtente}>
            <Text style={styles.nomeUtente}>{utente.nome}</Text>
            <Text style={styles.nomeUtente}>{utente.cognome}</Text>
          </View>

          {/*           <Text style={styles.infoCampionato}>
            Data inizio gara:{" "}
            {route.params.campionato.calendario[route.params.index].data}
          </Text> */}
          {/*           <Text style={styles.infoCampionato}>
            Numero di partecipanti:{" "}
            {route.params.campionato.piloti_iscritti.length}
          </Text> */}
        </View>
      </View>
      <View
        style={{
          flex: 3,
          marginTop: height > 800 ? 0 : "2%",
        }}
      >
        <ProfileTabNavScreen></ProfileTabNavScreen>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  usernameUtente: {
    fontSize: 35,
    fontFamily: "spyagencynorm",
    color: "white",
  },
  nomeUtente: {
    fontSize: 19,
    fontFamily: "spyagencygrad",
    color: "white",
  },
  infoUtente: {
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  infoCampionato: {
    fontSize: 15,
    marginVertical: "2%",
  },
  buttonIscriviti: {
    width: width / 3,
    backgroundColor: "white",
    alignSelf: "center",
  },
  buttonIscrivitiText: {
    color: "black",
  },
  textinput: {
    alignSelf: "center",
    height: 40,
    width: width / 2,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "lightblue",
    color: "white",
  },
  buttonRegistrati: {
    width: width / 3,
    alignSelf: "center",
    marginTop: 18,
  },
  regform: {
    width: width,
    marginTop: "5%",
    alignSelf: "stretch",
    alignItems: "center",
  },
});
