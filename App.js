import RegForm from "./app/components/RegForm";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

let screenWidth = Dimensions.get("window").width;
let screenHight = Dimensions.get("window").height;

export default function App() {
  //Load custom font
  const [isLoaded] = useFonts({
    spyagencygrad: require("./assets/fonts/SpyAgency/spyagency3grad.ttf"),
  });
  //Set image picker
  const pathToDefaultImage = "./assets/img/user.png";
  const [selectedImage, setSelectedImage] = React.useState(
    Image.resolveAssetSource(require(pathToDefaultImage)).uri
  );
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
    });
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage(pickerResult.uri);

    //Clean Up
    return () => {
      setSelectedImage(
        Image.resolveAssetSource(require(pathToDefaultImage)).uri
      );
    };
  };
  if (!isLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>SIM CAREER</Text>
        <TouchableOpacity onPress={openImagePickerAsync}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.ImgUtente}
          ></Image>
        </TouchableOpacity>
        <RegForm></RegForm>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(51, 102, 255, 0.73)",
    alignItems: "center",
  },
  header: {
    fontSize: 45,
    marginTop: screenHight * 0.08,
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
