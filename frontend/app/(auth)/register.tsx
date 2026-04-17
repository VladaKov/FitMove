import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { registerUser } from '../../services/auth';

export default function Register() {
    const router = useRouter();
    const [name, setName] = React.useState('');
    const [loginText, setLoginText] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleRegister = async () => {
        if (!name || !loginText || !password) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return;
        }

        if (password.length < 4) {
            Alert.alert('Ошибка', 'Пароль должен быть не менее 4 символов');
            return;
        }

        setLoading(true);
        const success = await registerUser(name, loginText, password);
        setLoading(false);

        if (success) {
            Alert.alert('Успех', 'Регистрация прошла успешно!');
            router.replace('/(tabs)');
        } else {
            Alert.alert('Ошибка', 'Не удалось зарегистрироваться. Возможно, логин уже занят');
        }
    };

    return (
        <View style={style.container}>
            <View style={style.containerForm}>
                <TouchableOpacity
                    style={style.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={style.backButtonText}>← Назад</Text>
                </TouchableOpacity>

                <Text style={style.title}>FitMove</Text>

                <Text style={style.textForm}>Введите имя</Text>
                <TextInput
                    style={style.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Имя"
                    placeholderTextColor="#646464"
                />

                <Text style={style.textForm}>Придумайте логин</Text>
                <TextInput
                    style={style.input}
                    onChangeText={setLoginText}
                    value={loginText}
                    placeholder="Логин"
                    placeholderTextColor="#646464"
                    autoCapitalize="none"
                />

                <Text style={style.textForm}>Придумайте пароль</Text>
                <TextInput
                    style={style.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Пароль"
                    placeholderTextColor="#646464"
                    secureTextEntry
                />

                <TouchableOpacity
                    style={style.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={style.buttonText}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Text>
                </TouchableOpacity>
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
    containerForm: {
        backgroundColor: '#0e0e0e',
        width: '90%',
        height: '70%',
        borderRadius: 30,
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
    backButtonText: {
        color: '#AACC12',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        color: '#AACC12',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 10,
    },
    textForm: {
        color: '#d1d1d1',
        fontSize: 20,
        fontWeight: 700,
        marginTop: 35,
        marginLeft: 30,
    },
    input: {
        height: 45,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        padding: 10,
        backgroundColor: '#181818',
        borderRadius: 15,
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#AACC12',
        padding: 8,
        width: '70%',
        borderRadius: 30,
        marginTop: 110,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#181818',
        fontSize: 17,
        fontWeight: 700,
        textAlign: 'center',
    }
});