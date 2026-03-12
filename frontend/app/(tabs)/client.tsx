import { View, Text, StyleSheet } from 'react-native';

export default function Client() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Страница клиентов</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});