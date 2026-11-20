import 'react-native-gesture-handler';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ResourceList from './components/ResourceList';
import SearchDialog from './components/SearchDialog';
import { colors } from './theme';

const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
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

// The original three screens now share a list that fetches their own API data.
function ScreenLayout({ name, resource }) {
  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      <View style={styles.heading}>
        <Text style={styles.series}>STAR WARS</Text>
        <View style={styles.rule} />
        <Text accessibilityRole="header" style={styles.title}>{name}</Text>
      </View>
      <SearchDialog screenName={name} />
      <ResourceList key={resource} resource={resource} />
    </SafeAreaView>
  );
}

function PlanetsScreen() {
  return <ScreenLayout name="Planets" resource="planets" />;
}
function FilmsScreen() {
  return <ScreenLayout name="Films" resource="films" />;
}
function SpaceshipsScreen() {
  return <ScreenLayout name="Spaceships" resource="starships" />;
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
  heading: { alignItems: 'flex-start', paddingHorizontal: 24, paddingTop: 20 },
  series: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 4 },
  rule: { width: 40, height: 2, backgroundColor: colors.accent, marginVertical: 12 },
  title: { color: colors.text, fontSize: 30, fontWeight: '700' },
  tabSymbol: { fontSize: 17, fontWeight: '700' },
});
