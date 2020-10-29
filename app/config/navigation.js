import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import RegForm from "../screens/RegForm.js";
import LogForm from "../screens/loginForm.js";
import Home from "../screens/home.js";
import Classifiche from "../screens/classifiche.js";
import Galleria from "../screens/galleria.js";
import Profilo from "../screens/profilo";
import { Text, Dimensions } from "react-native";
import { color } from "react-native-reanimated";

const LoginStack = createStackNavigator();
const LoginStackScreen = () => (
  <LoginStack.Navigator headerMode={"none"}>
    <LoginStack.Screen name="LoginForm" component={LogForm} />
    <LoginStack.Screen name="RegistrationForm" component={RegForm} />
    <LoginStack.Screen name="AppTabs" component={AppTabsScreen} />
  </LoginStack.Navigator>
);

const AppTabs = createMaterialTopTabNavigator();
const AppTabsScreen = () => (
  <AppTabs.Navigator
    tabBarPosition="bottom"
    initialRouteName="Home"
    initialLayout={{ width: Dimensions.get("window").width }}
    tabBarOptions={{
      showIcon: "true",
      showLabel: true,
      iconStyle: {
        alignItems: "center",
        flex: 1,
        height: 5,
        width: 40,
      },
      style: { backgroundColor: "rgba(51, 102, 255, 1)" },
      labelStyle: {
        fontSize: 10,
      },
      inactiveTintColor: "rgba(255, 255, 255, 0.5)",
      activeTintColor: "white",
      indicatorStyle: { backgroundColor: "white" },
    }}
  >
    <AppTabs.Screen
      name="Classifiche"
      component={Classifiche}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon size={30} name="list" color={color}></Icon>
        ),
      }}
    ></AppTabs.Screen>
    <AppTabs.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon size={30} name="home" color={color}></Icon>
        ),
      }}
    ></AppTabs.Screen>
    <AppTabs.Screen
      name="Galleria"
      component={Galleria}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon size={30} name="image" color={color}></Icon>
        ),
      }}
    ></AppTabs.Screen>
    <AppTabs.Screen
      name="Profilo"
      component={Profilo}
      options={{
        tabBarIcon: ({ color }) => (
          <Icon size={30} name="user" color={color}></Icon>
        ),
      }}
    ></AppTabs.Screen>
  </AppTabs.Navigator>
);

export default ({ route }) => (
  <NavigationContainer>
    <LoginStackScreen />
  </NavigationContainer>
);
