import { StatusBar } from "expo-status-bar";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from "@react-native-community/checkbox";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import { useForm, Controller } from "react-hook-form";
import { Button } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  DatePickerAndroid,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Component } from "react";
import config from "../config/config";
import Dots from "react-native-dots-pagination";
import { showMessage } from "react-native-flash-message";

let screenWidth = Dimensions.get("window").width;
let screenHight = Dimensions.get("window").height;

export default function RegForm({ navigation }) {
  //Load custom font
  const [isLoaded] = useFonts({
    spyagencygrad: require("../../assets/fonts/SpyAgency/spyagency3grad.ttf"),
  });
  //Set image picker
  const pathToDefaultImage = "../../assets/img/user.png";
  const [selectedImage, setSelectedImage] = React.useState({
    uri: Image.resolveAssetSource(require(pathToDefaultImage)).uri,
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

    setSelectedImage({ uri: pickerResult.uri, base64: pickerResult.base64 });
    //Clean Up
    return () => {
      setSelectedImage({
        uri: Image.resolveAssetSource(require(pathToDefaultImage)).uri,
        base64: "",
      });
    };
  };
  const [datePickerState, setDatePickerState] = React.useState({
    visibility: false,
    dateDisplay: "",
  });
  const { control, errors, handleSubmit, getValues, setValue } = useForm();
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
            imgUtente: selectedImage.base64,
            numero_in_gara_preferito: 0,
            id_numero_circuito_preferito: 0,
            id_numero_circuito_odiato: 0,
            id_auto_preferita: 0,
          },
        ]),
      }).then((response) => {
        if (response.status == "201") {
          showMessage({
            message: "Registrazione avvenuta con successo!",
            type: "success",
          });
          navigation.push("LoginForm");
        } else {
          showMessage({
            message: "Qualcosa è andato storto, mail o username già esistenti!",
            type: "danger",
            duration: 4000,
          });
          console.log(response.status);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  //CheckBox
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
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
  if (!isLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>SIM CAREER</Text>
        <TouchableOpacity onPress={openImagePickerAsync}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.ImgUtente}
          ></Image>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
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
              <View style={{ marginTop: screenHight * 0.23 }}>
                <Dots length={2} active={0} />
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.regform}>
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
                  <Text style={styles.errorText}>
                    {errors.residenza.message}
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <View style={{ flexDirection: "row" }}>
                      <CheckBox
                        value={toggleCheckBox}
                        checked={toggleCheckBox}
                        tintColors={{ true: "white" }}
                        onValueChange={() => {
                          toggleCheckBox
                            ? setToggleCheckBox(false)
                            : setToggleCheckBox(true);
                          setValue("checkboxTds", !toggleCheckBox);
                        }}
                      />
                      <Text style={{ marginTop: 6, color: "white" }}>
                        Ho letto ed accetto i TdS
                      </Text>
                    </View>
                  )}
                  name="checkboxTds"
                  rules={{ required: true }}
                  defaultValue=""
                />
                {errors.checkboxTds && (
                  <Text style={styles.errorText}>Campo richiesto</Text>
                )}
                <View style={styles.buttonRegistrati}>
                  <Button
                    title={"Registrati"}
                    titleStyle={{ fontFamily: "spyagencygrad", fontSize: 16 }}
                    onPress={handleSubmit(onSubmit)}
                  />
                </View>
                <View style={styles.dotStyle}>
                  <Dots length={2} active={1} />
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </View>
        {Object.keys(errors).length === 0 && errors.constructor === Object
          ? console.log("vuoto")
          : showMessage({
              message: "Qualcosa è andato storto, controlla i campi inseriti!",
              type: "danger",
              duration: 4000,
            })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(51, 102, 255, 0.73)",
    alignItems: "center",
    width: screenWidth,
    elevation: 1,
  },
  regform: {
    width: screenWidth,
    alignSelf: "stretch",
    alignItems: "center",
  },
  textinput: {
    alignSelf: "center",
    height: 40,
    width: screenWidth / 2,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "lightblue",
    color: "white",
  },
  buttonRegistrati: {
    width: screenWidth / 3,
    alignSelf: "center",
    marginTop: 18,
  },
  dotStyle: {
    position: "relative",
    marginTop: screenHight * 0.04,
  },
  errorText: {
    color: "red",
  },
  header: {
    fontSize: 45,
    marginTop: screenHight * 0.047,
    color: "white",
    fontFamily: "spyagencygrad",
  },
  ImgUtente: {
    marginBottom: 45,
    width: 139,
    height: 139,
    borderRadius: 139 / 2,
    alignSelf: "center",
    resizeMode: "contain",
    marginTop: screenHight * 0.06,
  },
});
