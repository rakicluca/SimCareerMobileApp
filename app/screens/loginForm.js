import React from "react";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import { useForm, Controller } from "react-hook-form";
import CheckBox from "@react-native-community/checkbox";
import { CommonActions } from "@react-navigation/native";
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
} from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-community/async-storage";
import config from "../config/config";
import syncStorage from "sync-storage";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import * as LocalAuthentication from "expo-local-authentication";
import { showMessage } from "react-native-flash-message";

let screenWidth = Dimensions.get("window").width;
let screenHight = Dimensions.get("window").height;

const registerForPushNotifications = async (utente) => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    alert("No notification permissions!");
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log(token);

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return await fetch(config.url.path + "/utenti/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: {
        value: token.data,
      },
      idUtente: utente.id,
    }),
  });
};

export default function LoginForm({ navigation }) {
  //Form Settings
  const {
    control,
    errors,
    handleSubmit,
    getValues,
    setValue,
    reset,
  } = useForm();
  const utenteFingerprint = syncStorage.get("utenteFingerprint");
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [rememberMeCheck, setRememberMeCheck] = React.useState(false);
  //Checkbox Settings
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);

  async function rememberMeOnLoad() {
    const login = await getRememberedUser();
    if (login != undefined) {
      reset({ username: login.username, password: login.password });
      setToggleCheckBox(true);
    }
  }
  const handleAuthentication = async () => {
    let result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      onSubmit();
    }
  };
  React.useEffect(() => {
    rememberMeOnLoad();
    //Fingerprint check for device compatibility
    async function checkDeviceForHardware() {
      let compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        console.log("Compatible Device!");
      } else {
        console.log("Current device does not have the necessary hardware!");
        showMessage({
          message:
            "Il tuo dispositivo non dispone del lettore d'impronte digitali",
          type: "warning",
        });
      }
    }
    //Fingerprint check for user fingerprint records
    const checkForBiometrics = async () => {
      let biometricRecords = await LocalAuthentication.isEnrolledAsync();
      if (!biometricRecords) {
        console.log("No Biometrics Found");
        showMessage({
          message:
            "Non sono state trovate impronte digitali registrate nel tuo dispositivo, vai nelle impostazioni del tuo dispositivo ed aggiungile",
          type: "warning",
          duration: 2500,
        });
      } else {
        console.log("Biometrics Found");
      }
    };
    checkDeviceForHardware();
    checkForBiometrics();
  }, []);
  React.useEffect(() => {
    if (utenteFingerprint != undefined) {
      handleAuthentication();
    }
  }, [utenteFingerprint]);

  const onSubmit = () => {
    global.username = getValues("username");
    if (toggleCheckBox) {
      setRememberMe(getValues("username"), getValues("password"));
    } else {
      removeRememberMe();
    }
    if (utenteFingerprint != undefined) {
      console.log(utenteFingerprint);
      fetch(
        config.url.path +
          "/utenti/" +
          utenteFingerprint.username +
          "/" +
          utenteFingerprint.password,
        {
          method: "GET",
          dataType: "json",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setLoginSuccess(false);
            return response.json();
          } else {
            setLoginSuccess(true);
          }
        })
        .then((response) => {
          if (response) {
            syncStorage.set("utente", response);
            registerForPushNotifications(response);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "AppTabs" }],
              })
            );
          }
        })
        .catch((er) => {
          console.log(er);
        });
    } else {
      console.log("dentro");
      fetch(
        config.url.path +
          "/utenti/" +
          getValues("username") +
          "/" +
          getValues("password"),
        {
          method: "GET",
          dataType: "json",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setLoginSuccess(false);
            return response.json();
          } else {
            setLoginSuccess(true);
          }
        })
        .then((response) => {
          if (response) {
            syncStorage.set("utente", response);
            registerForPushNotifications(response);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "AppTabs" }],
              })
            );
          }
        })
        .catch((er) => {
          console.log(er);
        });
    }
  };
  //Load custom font
  const [isLoaded] = useFonts({
    spyagencygrad: require("../../assets/fonts/SpyAgency/spyagency3grad.ttf"),
    spyagencynorm: require("../../assets/fonts/SpyAgency/spyagency3.ttf"),
  });

  const [isVisible, setIsVisible] = React.useState(false);
  const [email_for_reset, setEmail_for_reset] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  if (!isLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>SIM CAREER</Text>
          <Image
            source={require("../../assets/img/bdLogo.png")}
            style={styles.ImgUtente}
          />
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
            <View>
              <Text
                style={
                  loginSuccess ? styles.loginErrorText : { display: "none" }
                }
              >
                Username o password inserite non sono corrette
              </Text>
            </View>
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
                  <Text style={styles.testoCheckbox}>Ricordami</Text>
                </View>
              )}
              name="checkboxTds"
              defaultValue={"11111"}
            />
            {errors.checkboxTds && (
              <Text style={styles.errorText}>Campo richiesto</Text>
            )}
            <View style={styles.buttonRegistrati}>
              <Button
                title={"Login"}
                titleStyle={styles.textbuttonLogin}
                onPress={handleSubmit(onSubmit)}
                buttonStyle={styles.buttonLogin}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.push("RegistrationForm")}
            >
              <Text style={styles.registratiText}>
                Non ti sei ancora registrato? Registrati!
              </Text>
            </TouchableOpacity>
            <Text
              style={styles.passwordDimenticataText}
              onPress={() => {
                setIsVisible(true);
              }}
            >
              Passowrd dimenticata?
            </Text>
            {/* MODAL FOR RECOVERY PASSWORD */}
            <Modal
              isVisible={isVisible}
              onBackdropPress={() => {
                setIsVisible(false);
                setErrorMessage("");
              }}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Resetta la tua password</Text>
                <View style={styles.modalContent}>
                  <View style={styles.modalBody}>
                    <Input
                      placeholder="Inserisci la tua mail"
                      leftIcon={<Icon name="email" size={22}></Icon>}
                      onChangeText={(value) => setEmail_for_reset(value)}
                      errorMessage={errorMessage}
                    ></Input>
                  </View>
                </View>
                <View style={styles.modalBottom}>
                  <Button
                    title="Invia"
                    buttonStyle={{
                      width: screenWidth / 3,
                    }}
                    type="outline"
                    titleStyle={{ color: "#00BCD4", fontSize: 20 }}
                    onPress={() => {
                      sendEmailForResetPassword(email_for_reset).then((res) => {
                        if (res.status == "404")
                          setErrorMessage("Email non registrata");
                        else {
                          setIsVisible(false);
                          setErrorMessage("");
                        }
                      });
                    }}
                  ></Button>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
        <View style={styles.fingerprint}>
          <Button
            title="Accedi con riconoscimento biometrico"
            buttonStyle={{ backgroundColor: "transparent" }}
            titleStyle={{ fontFamily: "spyagencynorm", fontSize: 13 }}
            onPress={() => {
              if (utenteFingerprint != undefined) handleAuthentication();
              else
                showMessage({
                  message:
                    "Per usare questa funzione fare l'accesso ed abilitarla nelle impostazioni del proprio account",
                  type: "info",
                  duration: 3200,
                });
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  regform: {
    width: screenWidth,
    alignSelf: "stretch",
    alignItems: "center",
  },
  textinput: {
    height: 60,
    width: screenWidth / 2,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "lightblue",
    color: "white",
    fontSize: 15,
  },
  textbuttonLogin: {
    alignSelf: "center",
    fontFamily: "spyagencygrad",
    fontSize: 18,
  },
  buttonLogin: {
    marginTop: screenHight * 0.08,
    width: screenWidth / 3,
  },
  dotStyle: {
    position: "relative",
    marginTop: screenHight * 0.04,
  },
  errorText: {
    color: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(51, 102, 255, 0.73)",
    width: screenWidth,
  },
  header: {
    fontSize: 50,
    marginTop: screenHight * 0.047,
    color: "white",
    fontFamily: "spyagencygrad",
    alignSelf: "center",
  },
  ImgUtente: {
    alignSelf: "center",
    resizeMode: "contain",
    height: 200,
    width: 300,
    marginTop: 10,
  },
  testoCheckbox: {
    marginTop: 9,
    color: "white",
    fontFamily: "spyagencygrad",
  },
  registratiText: {
    fontFamily: "spyagencynorm",
    marginTop: screenHight * 0.05,
    color: "rgba(5, 102, 255, 1)",
    fontSize: 11,
    textDecorationLine: "underline",
    alignSelf: "center",
  },
  passwordDimenticataText: {
    fontFamily: "spyagencynorm",
    marginTop: 30,
    color: "white",
    fontSize: 10,
    textDecorationLine: "underline",
  },
  loginErrorText: {
    color: "red",
  },
  modalContainer: {
    backgroundColor: "white",
    //height: heigth > 800 ? heigth / 3.5 : heigth / 3,
    width: "100%",
    padding: "5%",
  },
  modalContent: { marginTop: "5%" },
  modalTitle: {
    fontSize: 22,
  },
  modalBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
  },
  modalBottom: {
    alignItems: "center",
    marginTop: screenHight > 800 ? "10%" : "5%",
  },
  modalButton: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#00BCD4",
  },
  fingerprint: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

async function setRememberMe(username, password) {
  try {
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("password", password);
  } catch (error) {
    console.log(error);
  }
}

async function removeRememberMe() {
  try {
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("password");
  } catch (error) {}
}

async function getRememberedUser() {
  try {
    const username = await AsyncStorage.getItem("username");
    const password = await AsyncStorage.getItem("password");
    if (username !== null) {
      // We have user!!
      return { username: username, password: password };
    }
  } catch (error) {
    // Error retrieving data
    console.error(errror);
  }
}

async function sendEmailForResetPassword(email) {
  console.log(email);
  return await fetch(config.url.path + "/utenti/reset", {
    method: "POST",
    dataType: "json",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
}
