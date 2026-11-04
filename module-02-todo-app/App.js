import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Task from './components/Task';

function TodoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={[
        styles.tasksWrapper,
        { paddingTop: Math.max(24, 80 - insets.top) },
      ]}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Today's tasks
        </Text>
        {/* Part 1 demonstrates a reusable component receiving a text prop. */}
        <View style={styles.items}>
          <Task text="Task 1" />
          <Task text="Task 2" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TodoScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8EAED' },
  tasksWrapper: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#111111' },
  items: { marginTop: 30 },
});
