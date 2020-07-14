import { StatusBar } from "expo-status-bar";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from "@react-native-community/checkbox";
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
  const [datePickerState, setDatePickerState] = React.useState({
    visibility: false,
    dateDisplay: "",
  });
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  const format = require("date-fns/format");
  let handleConfirm = (date) => {
    setDatePickerState({
      dateDisplay: format(date, "dd/MM/yyyy"),
    });
    return;
  };
  let onPressCancel = () => {
    setDatePickerState({ visibility: false });
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
      <View style={styles.regform}>
        <TextInput
          style={styles.textinput}
          placeholder="Inserisci il tuo username"
          underlineColorAndroid={"transparent"}
        ></TextInput>
        <TextInput
          style={styles.textinput}
          placeholder="Inserisci la tua email"
          underlineColorAndroid={"transparent"}
        ></TextInput>
        <TextInput
          style={styles.textinput}
          placeholder="Inserisci la tua password"
          underlineColorAndroid={"transparent"}
          secureTextEntry={true}
        ></TextInput>
        <TextInput
          style={styles.textinput}
          placeholder="Ripeti la tua password"
          underlineColorAndroid={"transparent"}
          secureTextEntry={true}
        ></TextInput>
        <View style={{ marginTop: 96 }}>
          <Dots length={2} active={0} />
        </View>
      </View>

      <View style={styles.regform}>
        <TextInput
          style={styles.textinput}
          placeholder="Inserisci il tuo nome"
          underlineColorAndroid={"transparent"}
        ></TextInput>
        <TextInput
          style={styles.textinput}
          placeholder="Inserisci il tuo cognome"
          underlineColorAndroid={"transparent"}
        ></TextInput>
        <TouchableOpacity onPress={() => onPresstextInput()}>
          <TextInput
            style={styles.textinput}
            placeholder="gg/mm/yyy"
            underlineColorAndroid={"transparent"}
            editable={false}
            value={datePickerState.dateDisplay}
          ></TextInput>
        </TouchableOpacity>
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
          <Button title={"Registrati"} />
        </View>
        <View style={styles.dotStyle}>
          <Dots length={2} active={1} />
        </View>
      </View>
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
    marginBottom: 18,
    borderBottomColor: "lightblue",
    borderBottomWidth: 1,
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
});
