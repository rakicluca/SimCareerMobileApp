import React from "react";
import { Image } from "react-native-elements";
import { StyleSheet } from "react-native";
import GridList from "react-native-grid-list";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";
import { cacheDirectory, downloadAsync } from "expo-file-system";
import ImageView from "react-native-image-viewing";

function transforToUriFormat(items) {
  let array = [];
  items.forEach((element) => {
    array.push({ uri: element.url });
  });
  return array;
}

export default function GridGallery({ route }) {
  let items = route.params.items;
  const [visible, setIsVisible] = React.useState(false);
  const [indexImage, setImageIndex] = React.useState();
  let images = transforToUriFormat(items);
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
      onPress={() => {
        setIsVisible(true);
        setImageIndex(index);
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
      <ImageView
        images={images}
        imageIndex={indexImage}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        onLongPress={async () => {
          const url = await downloadAsync(
            images[indexImage].uri,
            cacheDirectory + "tmp.png"
          );
          await Sharing.shareAsync(url.uri);
        }}
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
