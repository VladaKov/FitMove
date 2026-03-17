import { View, Text, TouchableOpacity, StyleSheet, TextInput  } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';


export default function login() {
    const router = useRouter();
    const [text, onChangeText] = React.useState('Логин');
    const [text2, onChangeText2] = React.useState('Пароль');

  return (
    <View style={style.container}>
      <View style={style.containerForm}>

        <View style={style.Form}>

          <Text style={style.textForm}>Введите логин</Text>
          <TextInput style={style.input} onChangeText={onChangeText} value={text}/>

          <Text style={style.textForm}>Введите пароль</Text>
          <TextInput style={style.input} onChangeText={onChangeText2} value={text2}/>

          <TouchableOpacity style={style.button} onPress={() => console.log('Нажата')}>
            <Text style={style.buttonText}>Войти</Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AACC12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm:{
    backgroundColor: '#0e0e0e',
    width: '90%',
    height: '55%',
    borderRadius: 30,
  },
  textForm:{
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 50,
  },
  Form:{
    marginTop: 20,
  },
  input: {
    height: 45,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#181818',
    borderRadius: 15,
    color: '#646464',
  },
  button:{
    backgroundColor: '#AACC12',
    padding: 6,
    width: '70%',
    borderRadius: 30,
    marginTop: 130,
    alignSelf: 'center',
  },
  buttonText:{
    color: '#181818',
    fontSize: 17,
    fontWeight: 500,
    textAlign: 'center',
  }
});