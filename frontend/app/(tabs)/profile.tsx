import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getUserName, logoutUser, getUserId, updateUserName } from '../../services/auth';
import { getClients } from '../../services/clientsService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Profile() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [clientsCount, setClientsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const name = await getUserName();
        setUserName(name || 'Пользователь');
        setNewName(name || '');

        const userId = await getUserId();
        if (userId) {
            const clients = await getClients(userId);
            setClientsCount(clients.length);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
            { text: 'Отмена', style: 'cancel' },
            {
                text: 'Выйти',
                style: 'destructive',
                onPress: async () => {
                    await logoutUser();
                    router.replace('/');
                }
            }
        ]);
    };

    const handleUpdateName = async () => {
        if (!newName) {
            Alert.alert('Ошибка', 'Введите имя');
            return;
        }
        const success = await updateUserName(newName);
        if (success) {
            setUserName(newName);
            setModalVisible(false);
            console.log('Успех, Имя изменено');
        } else {
            console.log('Ошибка, Не удалось изменить имя');
        }
    };

    if (loading) {
        return (
            <View style={style.container}>
                <ActivityIndicator size="large" color="#AACC12" />
            </View>
        );
    }

    return (
        <View style={style.container}>
            <View style={style.header}>
                <Text style={style.userName}>{userName}</Text>
            </View>

            <View style={style.analytics}>
                <View style={style.statCard}>
                    <Text style={style.statNumber}>{clientsCount}</Text>
                    <Text style={style.statLabel}>Клиентов</Text>
                </View>
                <View style={style.statCard}>
                    <Text style={style.statNumber}>0</Text>
                    <Text style={style.statLabel}>Тренировок</Text>
                </View>
            </View>

            <TouchableOpacity style={style.editButton} onPress={() => setModalVisible(true)}>
                <Text style={style.editText}>Изменить имя</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.logoutButton} onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={24} color="#000000" />
                <Text style={style.logoutText}>Выйти</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setNewName(userName);
                }}
            >
                <View style={style.modalOverlay}>
                    <View style={style.modalContent}>
                        <TouchableOpacity style={style.closeButton} onPress={() => {
                            setModalVisible(false);
                            setNewName(userName);
                        }}>
                            <MaterialCommunityIcons name="close" size={24} color="#AACC12" />
                        </TouchableOpacity>

                        <View style={style.containerModal}>
                            <Text style={style.textName}>Введите новое имя</Text>
                            <TextInput
                                style={style.input}
                                placeholder="Имя"
                                placeholderTextColor="#646464"
                                value={newName}
                                onChangeText={setNewName}
                            />

                            <TouchableOpacity onPress={handleUpdateName} style={style.saveButton}>
                                <Text style={style.saveText}>Сохранить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#AACC12',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 80,
        marginBottom: 40,
        alignItems: 'center',
    },
    userName: {
        color: '#000000',
        fontSize: 40,
        fontWeight: 'bold',
    },
    analytics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 40,
    },
    statCard: {
        backgroundColor: '#AACC12',
        borderWidth: 2,
        borderColor: '#000000',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        width: '45%',
    },
    statNumber: {
        color: '#000000',
        fontSize: 32,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#272727',
        fontSize: 14,
        marginTop: 5,
    },
    editButton: {
        backgroundColor: '#000000',
        borderWidth: 2,
        borderColor: '#000000',
        padding: 15,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        marginBottom: 20,
    },
    editText: {
        color: '#AACC12',
        fontSize: 20,
        fontWeight: '700',
    },
    logoutButton: {
        backgroundColor: '#AACC12',
        borderWidth: 2,
        borderColor: '#000000',
        padding: 15,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
    },
    logoutText: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#181818',
        borderRadius: 25,
        width: '90%',
        height: '35%',
        padding: 20,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    },
    containerModal: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    textName: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#0e0e0e',
        width: '100%',
        height: 50,
        padding: 15,
        borderRadius: 15,
        marginBottom: 70,
        color: '#646464',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#AACC12',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});