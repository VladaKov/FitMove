import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';

import { getClients, createClient, deleteClient } from '../../services/clientsService';
import { ClientResponse } from '../../services/types';

import { getUserId } from '../../services/auth';
import { useAppContext } from '../../context/AppContext';
import api from '../../services/api';

export default function Client() {
    const router = useRouter();
    const { refreshTrigger, triggerRefresh } = useAppContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [clients, setClients] = useState<ClientResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            loadClients();
        }, [refreshTrigger])
    );

    const loadClients = async () => {
        setLoading(true);
        const userId = await getUserId();
        const data = await getClients(Number(userId));

        const clientsWithLastDate = await Promise.all(
            data.map(async (client) => {
                try {
                    const response = await api.get(`/workout/client/${client.id}`);
                    const workouts = response.data;
                    if (workouts.length > 0) {
                        const lastWorkout = workouts.sort((a: any, b: any) =>
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                        )[0];
                        return {
                            ...client,
                            lastDate: lastWorkout.date
                        };
                    }
                    return { ...client, lastDate: null };
                } catch (error) {
                    console.error('Ошибка получения тренировок:', error);
                    return { ...client, lastDate: null };
                }
            })
        );

        setClients(clientsWithLastDate);
        setLoading(false);
    };

    const addClient = async () => {
        if (!name || !contact) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return;
        }

        const userId = await getUserId();
        await createClient({
            id_users: Number(userId),
            name: name,
            contact: contact
        });

        setName('');
        setContact('');
        setModalVisible(false);
        triggerRefresh();
    };

    const handleDeleteClient = (client: ClientResponse) => {
        Alert.alert(
            'Удалить клиента',
            `Вы уверены, что хотите удалить клиента "${client.name}"?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const workoutsResponse = await api.get(`/workout/client/${client.id}`);
                            const workouts = workoutsResponse.data;
                            for (const workout of workouts) {
                                const blocksResponse = await api.get(`/block_exercises/${workout.id}`);
                                const blocks = blocksResponse.data;
                                for (const block of blocks) {
                                    const exercisesResponse = await api.get(`/exercise/block/${block.id}`);
                                    const exercises = exercisesResponse.data;
                                    for (const exercise of exercises) {
                                        await api.delete(`/exercise/${exercise.id}`);
                                    }
                                    await api.delete(`/block_exercises/${block.id}`);
                                }
                                await api.delete(`/workout/${workout.id}`);
                            }
                            await deleteClient(client.id);
                            triggerRefresh();
                        } catch (error) {
                            console.error('Ошибка удаления клиента:', error);
                            Alert.alert('Ошибка', 'Не удалось удалить клиента');
                        }
                    }
                }
            ]
        );
    };

    const handleClientPress = (client: ClientResponse) => {
        router.push({
            pathname: '/(page)/clientInfo',
            params: {
                id: client.id,
                name: client.name,
                contact: client.contact
            }
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)}`;
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
            <TouchableOpacity onPress={() => setModalVisible(true)} style={style.iconButton}>
                <View style={style.buttonContent}>
                    <Text style={style.textplus}>Добавить клиента</Text>
                    <MaterialCommunityIcons style={style.iconplus} name="plus" />
                </View>
            </TouchableOpacity>

            {clients.length === 0 ? (
                <Text style={style.textNoClients}>Клиенты не найдены</Text>
            ) : (
                <FlatList
                    data={clients}
                    keyExtractor={(item) => item.id.toString()}
                    style={style.flatList}
                    contentContainerStyle={style.flatListContent}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleClientPress(item)} activeOpacity={0.7}>
                            <View style={style.containerClient}>
                                <View style={style.clientHeader}>
                                    <Text style={style.textNameClient}>{item.name}</Text>
                                    <TouchableOpacity
                                        style={style.deleteClientButton}
                                        onPress={() => handleDeleteClient(item)}
                                    >
                                        <MaterialCommunityIcons name="delete" size={24} color="#ff4444" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={style.textDateClient}>Был(а): {formatDate((item as any).lastDate)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(false); setName('');setContact('');}}
            >
                <View style={style.modalOverlay}>
                    <View style={style.modalContent}>
                        <TouchableOpacity style={style.closeButton} onPress={() => setModalVisible(false)}>
                            <MaterialCommunityIcons name="close" size={24} color="#AACC12" />
                        </TouchableOpacity>

                        <View style={style.containerModalClient}>
                            <Text style={style.textNewClient}>Введите имя клиента</Text>
                            <TextInput style={style.inputClient} placeholder="Фио" placeholderTextColor="#646464" value={name} onChangeText={setName}/>
                            <Text style={style.textNewClient}>Введите контактные данные клиента</Text>
                            <TextInput style={style.inputClient} placeholder="Контакт" placeholderTextColor="#646464" value={contact} onChangeText={setContact}/>

                            <TouchableOpacity onPress={addClient} style={style.saveButton}>
                                <View style={style.buttonContent}>
                                    <Text style={style.textplus}>Сохранить</Text>
                                </View>
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
        backgroundColor: '#0e0e0e',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconButton: {
        display: 'flex',
        backgroundColor: '#AACC12',
        width: 320,
        height: 50,
        padding: 10,
        marginTop: 80,
        marginBottom: 20,
        borderRadius: 30,
        justifyContent: 'center',
    },
    buttonContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
    },
    textplus: {
        color: '#0e0e0e',
        fontSize: 20,
        fontWeight: '500',
    },
    iconplus: {
        color: '#0e0e0e',
        fontSize: 25,
    },
    flatList: {
        width: '100%',
        flex: 1,
    },
    flatListContent: {
        paddingBottom: Platform.OS === 'ios' ? 100 : 200,
        paddingTop: 5,
    },
    containerClient: {
        backgroundColor: '#181818',
        width: '100%',
        minHeight: 90,
        marginTop: 20,
        borderRadius: 20,
        padding: 15,
    },
    clientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    textNameClient: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '600',
    },
    deleteClientButton: {
        padding: 5,
    },
    textDateClient: {
        color: '#646464',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    containerModalClient: {
        marginTop: 60,
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#181818',
        borderRadius: 25,
        width: '90%',
        minHeight: '60%',
        padding: 15,
        position: 'relative',
        borderColor: '#0e0e0e',
        borderWidth: 2,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    },
    textNewClient: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
    },
    saveButton: {
        display: 'flex',
        backgroundColor: '#AACC12',
        width: '100%',
        height: 50,
        padding: 10,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputClient: {
        backgroundColor: '#0e0e0e',
        width: '100%',
        height: 50,
        padding: 15,
        borderRadius: 15,
        marginBottom: 30,
        color: '#FFFFFF',
        fontSize: 15,
    },
    textNoClients: {
        color: '#d1d1d1',
        fontSize: 20,
        fontWeight: '500',
        marginTop: 20,
    }
});