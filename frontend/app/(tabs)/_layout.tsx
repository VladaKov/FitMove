import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: styles.tabBarActive.color,
        tabBarInactiveTintColor: styles.tabBarInactive.color,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={30} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="client"
        options={{
          title: 'Клиенты',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="groups" size={30} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={30} color={color} />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#181818',
    height: 80,
    paddingBottom: 0,
    borderTopWidth: 1.3,
    borderRightWidth: 1.3,
    borderBottomWidth: 1.3,
    borderLeftWidth: 1.3,
    borderRadius: 40,
    borderColor: '#0E0E0E',
    position: 'absolute',
    left: 20,
    right: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
  },
  tabBarActive: {
    color: '#AACC12',
  },
  tabBarInactive: {
    color: '#ffffff',
  },
  tabBarIcon: {
    marginTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});