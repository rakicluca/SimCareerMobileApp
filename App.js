import React from "react";
import Navigation from "./app/config/navigation";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import "./app/config/globalVariables";
import SyncStorage from "sync-storage";

export default function App() {
  React.useEffect(() => {
    async function initStorage() {
      let data = await SyncStorage.init();
      console.log("Storage is ready");
    }
    initStorage();
  });
  return <Navigation />;
}
