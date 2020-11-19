import React from "react";
import { Image } from "react-native-elements";
import { StyleSheet } from "react-native";
import GridList from "react-native-grid-list";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";
import { cacheDirectory, downloadAsync } from "expo-file-system";

export default function GridGallery({ route }) {
  let items = route.params.items;
  let renderItem = ({ item, index }) => (
    <Image
      style={styles.image}
      source={{
        uri: item.url,
      }}
      onLongPress={async () => {
        const url = await downloadAsync(item.url, cacheDirectory + "tmp.png");
        await Sharing.shareAsync(url.uri);
      }}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <GridList
        showSeparator
        data={items}
        numColumns={2}
        renderItem={renderItem}
        separatorBorderWidth={2}
        separatorBorderColor={"white"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(51, 102, 255, 0.8)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
