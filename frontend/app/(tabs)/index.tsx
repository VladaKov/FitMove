import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons  } from '@expo/vector-icons';

export default function Home() {
    const router = useRouter();

    const handlePress = () => {
      console.log('Кнопка с иконкой нажата (заглушка)');
    };

  return (
    <View style={style.container}>

      <View style={style.containerInfo}>

        <View style={style.containerInfoText}>
          <Text style={style.textGreetings}>Привет, Владислава</Text>
          <Text style={style.textGreetingsDate}>10 марта</Text>
        </View>

        <TouchableOpacity onPress={handlePress} style={style.iconButton}>
          <MaterialCommunityIcons style={style.iconbrightness_6} name="brightness-6"/>
        </TouchableOpacity>

      </View>

      <View style={style.containerMotivation}>
        <View style={style.textMotivation}>
          <Text style={style.textMotivation1}>Спорт —</Text>
          <Text style={style.textMotivation2}>это жизнь,</Text>
          <Text style={style.textMotivation3}>движение —</Text>
          <Text style={style.textMotivation4}>сила</Text>
        </View>
        <Image
          style={style.imgMan}
          source={require('../../assets/img/manMotivation.png')}
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#0e0e0e',
    flex: 1,
  },
  containerInfo:{
    marginLeft: 25,
    marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerInfoText: {
  },
  textGreetings: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 500,
  },
  textGreetingsDate: {
    color: '#646464',
    marginTop: 5,
  },
  iconButton: {
    backgroundColor: '#181818',
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 25,
  },
  iconbrightness_6: {
    color: '#646464',
    fontSize: 36,
    marginTop: 6,
    marginLeft: 6,
  },
  containerMotivation: {
    marginTop: 40,
    marginLeft: 15,
    height: 200,
    maxWidth: 400,
    backgroundColor: '#181818',
    borderRadius: 20,
  },
  textMotivation: {
  },
  textMotivation1: {
    color: '#AACC12',
    fontSize: 35,
    fontWeight: 900,
    fontStyle: 'italic',
    marginLeft: 40,
    marginTop: 20,
    marginBottom: 10,
  },
  textMotivation2: {
    color: '#ffffff',
    fontSize: 28,
    marginLeft: 25,
  },
  textMotivation3: {
    color: '#ffffff',
    fontSize: 20,
    marginLeft: 25,
  },
  textMotivation4: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 25,
  },
  imgMan: {
    position: 'absolute',
    right: 15,
    bottom: 0,
    width: 210,
    height: 230,
  }
});