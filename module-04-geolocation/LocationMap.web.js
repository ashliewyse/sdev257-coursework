import { Text, View } from 'react-native';

// react-native-maps uses native iOS/Android views, so it is not imported on Web.
export default function LocationMap() {
  return (
    <View style={{ padding: 24 }}>
      <Text>Choose iOS or Android in Snack to run the native GPS map.</Text>
    </View>
  );
}
