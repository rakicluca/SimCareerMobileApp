import { StatusBar } from "expo-status-bar";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from "@react-native-community/checkbox";
import { useForm, Controller } from "react-hook-form";
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
  Button,
  Platform,
  DatePickerAndroid,
  TouchableWithoutFeedback,
} from "react-native";
import { Component } from "react";
import Dots from "react-native-dots-pagination";

let screenWidth = Dimensions.get("window").width;
let screenHight = Dimensions.get("window").height;

export default function RegForm() {
  const [inputError, setinputError] = React.useState(false);
  const [datePickerState, setDatePickerState] = React.useState({
    visibility: false,
    dateDisplay: "",
  });
  const { control, errors, handleSubmit, getValues, setValue } = useForm();
  const onSubmit = (data) => {
    console.log("Data:" + getValues("data") + "nome:" + getValues("nome"));
  };
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const format = require("date-fns/format");
  let handleConfirm = (date) => {
    setDatePickerState({
      dateDisplay: format(date, "dd/MM/yyyy"),
    });
    setValue("data", date);
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
    <ScrollView
      horizontal={true}
      pagingEnabled={true}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
    >
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
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
          <View style={{ marginTop: 40 }}>
            <Dots length={2} active={0} />
          </View>
        </View>
      </ScrollView>

      <ScrollView>
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
          <TextInput
            style={styles.textinput}
            placeholder="Inserisci la tua residenza"
            underlineColorAndroid={"transparent"}
            secureTextEntry={true}
          ></TextInput>
          <View style={{ flexDirection: "row" }}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={() =>
                toggleCheckBox
                  ? setToggleCheckBox(false)
                  : setToggleCheckBox(true)
              }
            />
            <Text style={{ marginTop: 5 }}>Ho letto ed accetto i TdS</Text>
          </View>
          <View style={styles.buttonRegistrati}>
            <Button title={"Registrati"} onPress={handleSubmit(onSubmit)} />
          </View>
          <View style={styles.dotStyle}>
            <Dots length={2} active={1} />
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 10,
  },
  errorText: {
    color: "red",
  },
});
