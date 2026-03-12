// app/index.tsx
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>👋 Привет, мир!</Text>
    </View>
  );
}