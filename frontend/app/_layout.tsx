import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { isAuthenticated } from '../services/auth';
import { router } from 'expo-router';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        setIsLoggedIn(authenticated);
        if (authenticated) {
          console.log('Пользователь уже авторизован');
        } else {
          console.log('Пользователь не авторизован');
        }
      } catch (error) {
        console.log('Ошибка проверки авторизации:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/');
      }
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Text style={{ color: '#000000', fontSize: 40, fontWeight: '700'}}>FitMove</Text>
        <ActivityIndicator size="large" color="#000000"/>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal/info" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#AACC12',
    justifyContent: 'center',
    alignItems: 'center',
  },
});