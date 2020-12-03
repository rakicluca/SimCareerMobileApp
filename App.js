import React from "react";
import Navigation from "./app/config/navigation";
import "./app/config/globalVariables";
import SyncStorage from "sync-storage";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
  handleSuccess: () => {
    console.log("SERIO???????????????" + id);
  },
  handleError: (err) => {
    console.log(err);
  },
});

//this method will be called whenever a notification is received while the app is running.
Notifications.addNotificationReceivedListener(() => {
  console.log("CAN SPORCO");
});

export default class App extends React.Component {
  /* React.useEffect(() => {
    async function initStorage() {
      let data = await SyncStorage.init();
      console.log("Storage is ready");
    }
    initStorage();
  }, []); */
  componentDidMount() {
    async function initStorage() {
      let data = await SyncStorage.init();
      console.log("Storage is ready");
    }
    initStorage();
  }
  render() {
    return <Navigation />;
  }
}
