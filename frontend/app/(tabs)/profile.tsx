import { View, Text, Button, StyleSheet  } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
    const router = useRouter();

  return (
    <View style={style.container}>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
});