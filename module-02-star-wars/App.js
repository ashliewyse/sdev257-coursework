import 'react-native-gesture-handler';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const colors = { background: '#0b101a', surface: '#151e2d', text: '#f5f7fa', accent: '#ffe070' };
const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: '#2d394d',
  },
};

// Shared Flexbox layout; each screen displays its own name for this assignment.
function ScreenLayout({ name }) {
  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.series}>STAR WARS</Text>
        <View style={styles.rule} />
        <Text accessibilityRole="header" style={styles.title}>{name}</Text>
      </View>
    </SafeAreaView>
  );
}

function PlanetsScreen() {
  return <ScreenLayout name="Planets" />;
}
function FilmsScreen() {
  return <ScreenLayout name="Films" />;
}
function SpaceshipsScreen() {
  return <ScreenLayout name="Spaceships" />;
}

const screens = [
  { name: 'Planets', component: PlanetsScreen, symbol: 'P' },
  { name: 'Films', component: FilmsScreen, symbol: 'F' },
  { name: 'Spaceships', component: SpaceshipsScreen, symbol: 'S' },
];

function BottomTabs() {
  return (
    <Tabs.Navigator screenOptions={{
      headerTintColor: colors.text,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: '#b3bfd1',
      tabBarLabelStyle: { fontSize: 12 },
    }}>
      {screens.map(({ name, component, symbol }) => (
        <Tabs.Screen key={name} name={name} component={component}
          options={{ tabBarIcon: ({ color }) => (
            <Text style={[styles.tabSymbol, { color }]}>{symbol}</Text>
          ) }} />
      ))}
    </Tabs.Navigator>
  );
}

function AndroidDrawer() {
  return (
    <Drawer.Navigator screenOptions={{
      headerTintColor: colors.text,
      drawerActiveTintColor: colors.accent,
      drawerInactiveTintColor: colors.text,
      drawerActiveBackgroundColor: '#2b3547',
    }}>
      {screens.map(({ name, component }) => (
        <Drawer.Screen key={name} name={name} component={component} />
      ))}
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <NavigationContainer theme={theme}>
          {/* The assignment requires a drawer on Android and bottom tabs on iOS.
              Web also uses tabs so the browser preview is easy to navigate. */}
          {Platform.OS === 'android' ? <AndroidDrawer /> : <BottomTabs />}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  series: { color: colors.accent, fontSize: 18, fontWeight: '700', letterSpacing: 4 },
  rule: { width: 40, height: 3, backgroundColor: colors.accent, marginVertical: 22 },
  title: { color: colors.text, fontSize: 32, fontWeight: '700', textAlign: 'center' },
  tabSymbol: { fontSize: 17, fontWeight: '700' },
});
