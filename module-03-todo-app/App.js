import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Task from './components/Task';

function TodoScreen() {
  const insets = useSafeAreaInsets();
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const nextTaskId = useRef(1);

  function handleAddTask() {
    const text = task.trim();
    if (!text) return;

    // Stable IDs let tasks with identical names be completed independently.
    const newTask = { id: nextTaskId.current++, text };
    setTaskItems((currentItems) => [...currentItems, newTask]);
    setTask('');
    Keyboard.dismiss();
  }

  function completeTask(id) {
    // Create a new array instead of changing the current state directly.
    setTaskItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.tasksWrapper,
            { paddingTop: Math.max(24, 80 - insets.top) },
          ]}
          keyboardShouldPersistTaps="handled">
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Today's tasks
          </Text>
          <Text style={styles.helperText}>Tap a task to complete it.</Text>
          <View style={styles.items}>
            {taskItems.length === 0 ? (
              <Text style={styles.emptyText}>No tasks yet. Add one below.</Text>
            ) : (
              taskItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Complete task: ${item.text}`}
                  accessibilityHint="Removes this completed task from the list"
                  onPress={() => completeTask(item.id)}>
                  <Task text={item.text} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>

        {/* Flex layout keeps the input below the list and above the keyboard. */}
        <View style={[
          styles.writeTaskWrapper,
          { paddingBottom: Math.max(20, insets.bottom) },
        ]}>
          <TextInput
            style={styles.input}
            placeholder="Write a task"
            placeholderTextColor="#595F68"
            accessibilityLabel="Write a task"
            value={task}
            onChangeText={setTask}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={[styles.addWrapper, !task.trim() && styles.addDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Add task"
            accessibilityState={{ disabled: !task.trim() }}
            disabled={!task.trim()}
            onPress={handleAddTask}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  content: { flex: 1 },
  tasksWrapper: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#111111' },
  helperText: { marginTop: 8, fontSize: 14, color: '#505762' },
  items: { marginTop: 30 },
  emptyText: { fontSize: 14, color: '#505762', lineHeight: 22 },
  writeTaskWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginRight: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    fontSize: 16,
    color: '#111111',
  },
  addWrapper: {
    width: 60,
    height: 60,
    flexShrink: 0,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addDisabled: { opacity: 0.5 },
  addText: { fontSize: 28, color: '#111111' },
});
