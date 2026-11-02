import { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

// Layout adapted from the Chapter 17 example; see LICENSE and README.md.
function Box({ number, size }) {
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Text style={styles.boxText}>#{number}</Text>
    </View>
  );
}

function FlexboxLayout() {
  const [available, setAvailable] = useState({ width: 0, height: 0 });

  // Keep the textbook's 100-point squares, shrinking them on smaller screens.
  // The measured area already excludes the status bar and other safe areas.
  const boxSize = available.height
    ? Math.max(1, Math.min(100, available.width / 2 - 16, available.height / 6 - 8))
    : 100;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar barStyle="dark-content" />
      <View
        style={styles.layout}
        onLayout={({ nativeEvent }) => setAvailable(nativeEvent.layout)}>
        {/* Each row contains two columns, and each column contains two boxes. */}
        {[1, 5, 9].map((firstNumber) => (
          <View key={firstNumber} style={styles.row}>
            {[0, 2].map((offset) => (
              <View key={offset} style={styles.column}>
                <Box number={firstNumber + offset} size={boxSize} />
                <Box number={firstNumber + offset + 1} size={boxSize} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <FlexboxLayout />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'ghostwhite' },
  layout: { flex: 1, flexDirection: 'column' },
  row: { flex: 1, flexDirection: 'row' },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'darkslategray',
    backgroundColor: 'lightgray',
  },
  boxText: { color: 'darkslategray', fontWeight: 'bold' },
});
