import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../services/auth';

export default function StartScreen() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await isAuthenticated();
            if (authenticated) {
                router.replace('/(tabs)');
            } else {
                setChecking(false);
            }
        };
        checkAuth();
    }, []);

    if (checking) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#AACC12" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>FitMove</Text>
                <Text style={styles.slogan}>Твой путь к идеальному телу</Text>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={styles.loginButtonText}>Войти</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => router.push('/(auth)/register')}
                >
                    <Text style={styles.registerButtonText}>Регистрация</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AACC12',
        justifyContent: 'space-between',
        paddingVertical: 80,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    logoText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    slogan: {
        fontSize: 18,
        color: '#000000',
        opacity: 0.8,
    },
    buttonsContainer: {
        paddingHorizontal: 40,
        gap: 20,
        marginBottom: 50,
    },
    loginButton: {
        backgroundColor: '#000000',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#AACC12',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000',
    },
    registerButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});