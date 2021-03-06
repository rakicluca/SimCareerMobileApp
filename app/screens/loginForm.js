import React, { useState } from "react";
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
  SafeAreaView,
  Animated,
  Easing,
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

let screenWidth = Dimensions.get("screen").width;
let screenHight = Dimensions.get("screen").height;

async function getCampionatoById(idCampionato) {
  await fetch(config.url.path + "/campionati/" + idCampionato)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      syncStorage.set("campionato", JSON.stringify(res));
      syncStorage.set("listagare", JSON.stringify(res.calendario));
    });
}

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
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [rememberMeCheck, setRememberMeCheck] = React.useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const animatedBounce = React.useRef(new Animated.Value(0)).current;
  const [stopAnimat, setStopAnimat] = React.useState(false);
  const [contentHeightScroll, setContentHeightScroll] = useState(screenHight);

  //Checkbox Settings
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
  //const [utenteFingerprint, setUtenteFingerprint] = React.useState();
  let utenteFingerprint;
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
  //Fingerprint check for device compatibility
  async function checkDeviceForHardware() {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      console.log("Compatible Device!");
    } else {
      console.log("Current device does not have the necessary hardware!");
    }
    return compatible;
  }
  //Fingerprint check for user fingerprint records
  const checkForBiometrics = async () => {
    let biometricRecords = await LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
      console.log("No Biometrics Found");
    } else {
      console.log("Biometrics Found");
    }
    return biometricRecords;
  };

  function spring() {
    if (!stopAnimat) animatedBounce.setValue(0.3);
    Animated.spring(animatedBounce, {
      toValue: 1,
      friction: 1,
      useNativeDriver: true,
    }).start(() => {
      //console.log(stopAnimation);
      if (!stopAnimat) spring();
      else console.log("else start", stopAnimat);
    });
  }
  React.useEffect(() => {
    spring();
    rememberMeOnLoad();
    if (!checkDeviceForHardware()) {
      showMessage({
        message:
          "Il tuo dispositivo non dispone del lettore d'impronte digitali",
        type: "warning",
      });
    } else if (!checkForBiometrics()) {
      showMessage({
        message:
          "Non sono state trovate impronte digitali registrate nel tuo dispositivo, vai nelle impostazioni del tuo dispositivo ed aggiungile",
        type: "warning",
        duration: 2500,
      });
    }
  }, []);
  React.useEffect(() => {
    getUser("utenteFingerprint")
      .then((response) => {
        return response;
      })
      .then((res) => {
        try {
          utenteFingerprint = JSON.parse(res);
          if (utenteFingerprint != undefined) {
            handleAuthentication();
          }
        } catch (error) {
          console.log(error);
        }
      });
  }, [utenteFingerprint]);

  const onSubmit = () => {
    global.username = getValues("username");
    let notifica_data = syncStorage.get("NotificaData");
    if (toggleCheckBox) {
      setRememberMe(getValues("username"), getValues("password"));
    } else {
      removeRememberMe();
    }
    //Login se utente_impronta esiste
    if (utenteFingerprint != undefined) {
      fetch(
        config.url.path +
          "/utenti/" +
          utenteFingerprint.username +
          "/" +
          escape(utenteFingerprint.password),
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
            if (notifica_data != undefined) {
              getCampionatoById(notifica_data.id).then(() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [
                      { name: "AppTabs" },
                      {
                        name: "AppTabs",
                        params: {
                          screen: "Home",
                          params: {
                            screen: notifica_data.type,
                            params: {
                              campionato: JSON.parse(
                                syncStorage.get("campionato")
                              ),
                            },
                          },
                        },
                      },
                    ],
                  })
                );
                syncStorage.remove("NotificaData");
              });
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "AppTabs" }],
                })
              );
            }
          }
        })
        .catch((er) => {
          console.log(er);
        });
    } else {
      //Login con username e password
      fetch(
        config.url.path +
          "/utenti/" +
          getValues("username") +
          "/" +
          escape(getValues("password")),
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
            if (notifica_data != undefined) {
              getCampionatoById(notifica_data.id);
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: "AppTabs" },
                    {
                      name: "AppTabs",
                      params: {
                        screen: "Home",
                        params: {
                          screen: notifica_data.type,
                          params: {
                            campionato: JSON.parse(
                              syncStorage.get("campionato")
                            ),
                          },
                        },
                      },
                    },
                  ],
                })
              );
              syncStorage.remove("NotificaData");
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "AppTabs" }],
                })
              );
            }
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
  const ScrollViewRef = React.useRef();

  if (!isLoaded) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          ref={ScrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(contentWidth, contentHeight) => {
            console.log("St", contentWidth, contentHeight);
            setContentHeightScroll(contentHeight);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          onScrollBeginDrag={() => {
            setStopAnimat(true);
          }}
        >
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
            <View
              style={{
                flexDirection: "row-reverse",
                width: screenWidth,
                marginTop: "10%",
              }}
            >
              <View style={{ flex: 1, alignSelf: "center" }}>
                {contentHeightScroll > screenHight ? (
                  <Animated.View
                    style={{
                      transform: [{ scale: animatedBounce }],
                      opacity: scrollY.interpolate({
                        inputRange: [0, contentHeightScroll - screenHight],
                        outputRange: [1, 0],
                      }),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        ScrollViewRef.current.scrollToEnd({ animated: true });
                      }}
                    >
                      <Icon
                        name="arrow-down-circle"
                        type="feather"
                        color="white"
                        size={37}
                      ></Icon>
                    </TouchableOpacity>
                  </Animated.View>
                ) : (
                  <View />
                )}
              </View>
              <View style={{ flex: 2, alignItems: "flex-end" }}>
                <Button
                  title={"Login"}
                  titleStyle={styles.textbuttonLogin}
                  onPress={handleSubmit(onSubmit)}
                  buttonStyle={styles.buttonLogin}
                />
              </View>
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
                        if (res.status == "404") {
                          setErrorMessage("Email non registrata");
                          showMessage({
                            message:
                              "La mail inserita non è associata a nessun account",
                            type: "danger",
                          });
                        } else {
                          setIsVisible(false);
                          showMessage({
                            message:
                              "Reset della password avvenuto con successo, controlla la tua email",
                            type: "success",
                          });
                          setErrorMessage("");
                        }
                      });
                    }}
                  ></Button>
                </View>
              </View>
            </Modal>
          </View>
          {checkDeviceForHardware ? (
            <View style={styles.fingerprint}>
              <Button
                title="Accedi con riconoscimento biometrico"
                buttonStyle={{ backgroundColor: "transparent" }}
                titleStyle={{ fontFamily: "spyagencynorm", fontSize: 13 }}
                onPress={() => {
                  getUser("utenteFingerprint").then((response) => {
                    try {
                      if (response != undefined) {
                        utenteFingerprint = JSON.parse(response);
                        handleAuthentication();
                      } else
                        showMessage({
                          message:
                            "Per usare questa funzione fare l'accesso ed abilitarla nelle impostazioni del proprio account",
                          type: "info",
                          duration: 3200,
                        });
                    } catch (error) {
                      showMessage({
                        message:
                          "Se hai effettuato il logout devi accedere ed attivare questa funzione nelle impostazioni del tuo profilo",
                        type: "info",
                        duration: 3200,
                      });
                      console.log(error);
                    }
                  });
                }}
              />
            </View>
          ) : (
            <AppLoading />
          )}
        </ScrollView>
      </SafeAreaView>
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
    backgroundColor: "rgba(51, 102, 255, 0.73)",
    width: screenWidth,
    flex: 1,
  },
  header: {
    fontSize: screenHight < 700 ? 45 : 50,
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
    justifyContent: "flex-end",
    flex: 1,
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
async function getUser(field) {
  try {
    const utente = await AsyncStorage.getItem(field);
    if (utente !== null) {
      // We have user!!
      return utente;
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
