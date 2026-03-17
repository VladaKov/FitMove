import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    };

    prepare();
  }, []);
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Text style={{ color: '#000000', fontSize: 40, fontWeight: 700}}>FitMove</Text>
        <ActivityIndicator size="large" color="#000000"/>
      </View>
    );
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="modal/info" options={{ presentation: 'modal' }}/>
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