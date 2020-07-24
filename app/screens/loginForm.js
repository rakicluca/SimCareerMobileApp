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
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

let screenWidth = Dimensions.get("window").width;
let screenHight = Dimensions.get("window").height;

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
  React.useEffect(() => {
    async function rememberMeOnLoad() {
      const login = await getRememberedUser();
      console.log(login);
      if (login != undefined) {
        reset({ username: login.username, password: login.password });
        setToggleCheckBox(true);
      }
    }
    rememberMeOnLoad();
  }, []);

  const onSubmit = (data) => {
    global.username = getValues("username");
    if (toggleCheckBox) {
      setRememberMe(getValues("username"), getValues("password"));
    } else {
      removeRememberMe();
    }
    fetch(
      "http://192.168.1.18:3000/utenti/" +
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
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "AppTabs" }],
            })
          );
        }
      });
  };
  //Load custom font
  const [isLoaded] = useFonts({
    spyagencygrad: require("../../assets/fonts/SpyAgency/spyagency3grad.ttf"),
    spyagencynorm: require("../../assets/fonts/SpyAgency/spyagency3.ttf"),
  });
  //Checkbox Settings
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false);
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
            <Text style={styles.passwordDimenticataText}>
              Passowrd dimenticata?
            </Text>
          </View>
        </ScrollView>
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
  }
}
