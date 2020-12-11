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
  TouchableOpacityComponent,
  Switch,
} from "react-native";
import InfoGara from "./info_Gara";
import ClassificaGara from "./classifiche_Gare";
import syncStorage from "sync-storage";
import { Controller, useForm } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Icon } from "react-native-elements";
import config from "../config/config";
import DropDownPicker from "react-native-dropdown-picker";
import { AppLoading } from "expo";
import { showMessage } from "react-native-flash-message";
import * as ImagePicker from "expo-image-picker";

let width = Dimensions.get("screen").width;
let height = Dimensions.get("screen").height;

function getData(dataName) {
  let data = syncStorage.get(dataName);
  return JSON.parse(data);
}

function getListaVetture(setListaVetture) {
  let dropdown_lista = [];
  fetch(config.url.path + "/auto")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      res.forEach((element) => {
        dropdown_lista.push({
          id: element.idAuto,
          label: element.nome,
          value: element.idAuto,
        });
      });
      setListaVetture([...dropdown_lista]);
      return true;
    });
}
async function getListaCircuiti(setListaCircuiti) {
  let dropdown_lista = [];
  await fetch(config.url.path + "/circuiti")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      res.forEach((element) => {
        dropdown_lista.push({
          id: element.idCircuito,
          label: element.nome,
          value: element.idCircuito,
        });
      });
      setListaCircuiti([...dropdown_lista]);
      return true;
    });
}

const InfoUtente = () => {
  let utente = syncStorage.get("utente");
  let utenteFingerprint = syncStorage.get("utenteFingerprint");
  const { control, errors, handleSubmit, getValues, setValue } = useForm({
    defaultValues: {
      username: utente.username,
      email: utente.email,
      password: utente.password,
      nome: utente.nome,
      cognome: utente.cognome,
      residenza: utente.residenza,
      data: utente.data_nascita,
      numero_preferito_gara: utente.numero_in_gara_preferito + "",
    },
  });
  const [datePickerState, setDatePickerState] = React.useState({
    visibility: false,
    dateDisplay: utente.data_nascita,
  });
  const [isVisible, setIsVisible] = React.useState({
    dropAuto: false,
    dropCircuiti: false,
    dropCircuitiOdiati: false,
  });
  const [listaVetture, setListaVetture] = React.useState([]);
  const [listaCircuiti, setListaCircuiti] = React.useState([]);
  const [vetturaPrefPicked, setVetturaPrefPicked] = React.useState(
    utente.id_auto_preferita
  );
  const [circuitoPrefPicked, setCircuitoPrefPicked] = React.useState(
    utente.id_numero_circuito_preferito
  );
  const [circuitoOdiatoPicked, setCircuitoOdiatoPicked] = React.useState(
    utente.id_numero_circuito_odiato
  );
  const [isEnabled, setIsEnabled] = React.useState(
    utenteFingerprint != undefined ? !utenteFingerprint.enabled : false
  );
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  React.useEffect(() => {
    getListaVetture(setListaVetture);
    getListaCircuiti(setListaCircuiti);
  }, []);

  //OnSubmit Form
  const onSubmit = (data) => {
    try {
      fetch(config.url.path + "/utenti/" + utente.username, {
        method: "PUT",
        dataType: "json",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            email: data.email != utente.email ? data.email : undefined,
            password: data.password,
            nome: data.nome,
            cognome: data.cognome,
            data_nascita: data.data,
            residenza: data.residenza,
            imgUtente: selectedImage.base64,
            numero_in_gara_preferito: data.numero_preferito_gara,
            id_numero_circuito_preferito: circuitoPrefPicked.id,
            id_numero_circuito_odiato: circuitoOdiatoPicked.id,
            id_auto_preferita: vetturaPrefPicked.id,
          },
        ]),
      }).then((response) => {
        if (response.status == "201")
          showMessage({
            message: "Modifica avvenuta con successo!",
            type: "success",
          });
        else {
          showMessage({
            message: "Qualcosa è andato storto, riprova!",
            type: "danger",
          });
        }
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
  function changeVisibility(state) {
    setIsVisible({
      ...state,
    });
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: "rgba(51, 102, 255,0.5)",
      }}
    >
      <ScrollView>
        <View style={styles.regform}>
          <Text style={styles.infoUtenteText}>Email</Text>
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
                keyboardType="email-address"
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
          <Text style={styles.infoUtenteText}>Password</Text>
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
                keyboardType="default"
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
          <Text style={styles.infoUtenteText}>Nome</Text>
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
          <Text style={styles.infoUtenteText}>Cognome</Text>
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
          <Text style={styles.infoUtenteText}>Data di nascita</Text>
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
          <Text style={styles.infoUtenteText}>Indirizzo di residenza</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={styles.textinput}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Inserisci la tua residenza"
                underlineColorAndroid={"transparent"}
              />
            )}
            name="residenza"
            rules={{ required: { value: true, message: "Campo richiesto" } }}
            defaultValue=""
          />
          {errors.residenza && (
            <Text style={styles.errorText}>{errors.residenza.message}</Text>
          )}
          <Text style={styles.infoUtenteText}>Numero preferito in gara</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                style={[
                  styles.textinput,
                  { textAlign: "center", width: width / 4, marginBottom: "5%" },
                ]}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="Numero preferito in gara"
                underlineColorAndroid={"transparent"}
                keyboardType="number-pad"
              />
            )}
            name="numero_preferito_gara"
            rules={{ required: { value: true, message: "Campo richiesto" } }}
            defaultValue=""
          />
          {errors.numero_preferito_gara && (
            <Text style={styles.errorText}>
              {errors.numero_preferito_gara.message}
            </Text>
          )}
          <Text style={styles.infoUtenteText}>Vettura preferita</Text>
          {listaVetture.length != 0 ? (
            <DropDownPicker
              items={listaVetture}
              defaultValue={utente.id_auto_preferita}
              isVisible={isVisible.dropAuto}
              onOpen={() => {
                changeVisibility({
                  dropAuto: true,
                  dropCircuiti: false,
                  dropCircuitiOdiati: false,
                });
              }}
              onClose={() => {
                changeVisibility({
                  dropAuto: false,
                  dropCircuiti: false,
                  dropCircuitiOdiati: false,
                });
              }}
              itemStyle={{ justifyContent: "flex-start" }}
              placeholder="Seleziona la tua auto preferita"
              placeholderStyle={{ justifyContent: "flex-start" }}
              dropDownMaxHeight={100}
              containerStyle={{
                width: width / 1.5,
                marginBottom: "7%",
                marginTop: "1%",
              }}
              style={{ width: width / 1.5 }}
              onChangeItem={(item) => {
                console.log(item);
                setVetturaPrefPicked(item);
              }}
            />
          ) : (
            <AppLoading />
          )}
          <Text style={styles.infoUtenteText}>Circuito preferito</Text>
          {listaCircuiti.length != 0 ? (
            <DropDownPicker
              items={listaCircuiti}
              defaultValue={utente.id_numero_circuito_preferito}
              isVisible={isVisible.dropCircuiti}
              onOpen={() =>
                changeVisibility({
                  dropAuto: false,
                  dropCircuiti: true,
                  dropCircuitiOdiati: false,
                })
              }
              onClose={() =>
                changeVisibility({
                  dropAuto: false,
                  dropCircuiti: false,
                  dropCircuitiOdiati: false,
                })
              }
              itemStyle={{ justifyContent: "flex-start" }}
              placeholder="Seleziona il tuo circuito preferito"
              placeholderStyle={{ justifyContent: "flex-start" }}
              containerStyle={{
                width: width / 1.5,
                marginBottom: "7%",
                marginTop: "1%",
              }}
              dropDownMaxHeight={100}
              style={{ width: width / 1.5 }}
              onChangeItem={(item) => {
                console.log(item);
                setCircuitoPrefPicked(item);
              }}
            />
          ) : (
            <AppLoading />
          )}
          <Text style={styles.infoUtenteText}>Circuito odiato</Text>
          {listaCircuiti.length != 0 ? (
            <DropDownPicker
              items={listaCircuiti}
              defaultValue={utente.id_numero_circuito_odiato}
              onOpen={() =>
                changeVisibility({
                  dropAuto: false,
                  dropCircuiti: false,
                  dropCircuitiOdiati: true,
                })
              }
              onClose={() =>
                changeVisibility({
                  dropAuto: false,
                  dropCircuiti: false,
                  dropCircuitiOdiati: false,
                })
              }
              isVisible={isVisible.dropCircuitiOdiati}
              itemStyle={{ justifyContent: "center" }}
              placeholder="Seleziona il tuo circuito odiato"
              placeholderStyle={{ justifyContent: "flex-start" }}
              containerStyle={{
                width: width / 1.5,
                marginBottom: "8%",
                marginTop: "1%",
              }}
              dropDownMaxHeight={100}
              style={{
                width: width / 1.5,
              }}
              onChangeItem={(item) => {
                console.log(item);
                setCircuitoOdiatoPicked(item);
              }}
            />
          ) : (
            <AppLoading />
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.infoUtenteImpronta}>
              Login con impronta digitale
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={isEnabled ? "#02e609" : "#ff4026"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                toggleSwitch();
                if (!isEnabled) {
                  utenteFingerprint = utente;
                  utenteFingerprint.enabled = isEnabled;
                  syncStorage.set("utenteFingerprint", utenteFingerprint);
                } else syncStorage.remove("utenteFingerprint");
              }}
              value={isEnabled}
            ></Switch>
          </View>

          <View style={styles.buttonRegistrati}>
            <Button
              title={"Salva"}
              titleStyle={{ fontFamily: "spyagencynorm", fontSize: 16 }}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
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
      name="Info Ed Impostazioni"
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
  //Set image picker
  const [selectedImage, setSelectedImage] = React.useState({
    uri: utente.imgUtente,
    base64: "",
  });
  let openImagePickerAsync = async () => {
    let permissionResultRoll = await ImagePicker.requestCameraRollPermissionsAsync();
    let permissionResultCamera = await ImagePicker.requestCameraPermissionsAsync();

    if (
      permissionResultRoll.granted === false ||
      permissionResultCamera.granted === false
    ) {
      alert("Permission to access camera roll and camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
    });
    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage({
      uri: pickerResult.uri,
      base64: pickerResult.base64,
    });
    //Clean Up
    return () => {
      setSelectedImage({
        uri: utente.imgUtente,
        base64: "",
      });
    };
  };
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
          <TouchableOpacity onPress={openImagePickerAsync}>
            <Image
              style={{
                width: 180,
                height: 180,
                borderRadius: 190 / 2,
                resizeMode: "cover",
              }}
              source={{
                uri: selectedImage.uri,
              }}
            />
          </TouchableOpacity>
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
    width: width / 1.5,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "lightblue",
    color: "white",
  },
  buttonRegistrati: {
    width: width / 3,
    alignSelf: "center",
    marginTop: "15%",
    marginBottom: "5%",
  },
  regform: {
    width: width,
    marginTop: "5%",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  infoUtenteText: {
    color: "white",
    fontFamily: "spyagencygrad",
    marginTop: "3%",
    fontSize: 17,
  },
  infoUtenteImpronta: {
    color: "white",
    fontFamily: "spyagencygrad",
    fontSize: 15,
  },
});
