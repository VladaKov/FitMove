import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { updateClient } from '../../services/clientsService';
import { getUserId } from '../../services/auth';
import api from '../../services/api';

export default function ClientInfo() {
    const params = useLocalSearchParams();
    const id = typeof params.id === 'string' ? parseInt(params.id) : parseInt(params.id?.[0] || '0');
    const clientName = typeof params.name === 'string' ? params.name : params.name?.[0] || '';
    const clientContact = typeof params.contact === 'string' ? params.contact : params.contact?.[0] || '';

    const { refreshTrigger, triggerRefresh } = useAppContext();

    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState(clientName);
    const [newContact, setNewContact] = useState(clientContact);
    const [currentName, setCurrentName] = useState(clientName);
    const [currentContact, setCurrentContact] = useState(clientContact);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadWorkouts = async () => {
        setLoading(true);
        const userId = await getUserId();
        if (userId && id) {
            try {
                const response = await api.get(`/workout/client/${id}`, {
                    headers: { 'user-id': userId.toString() }
                });
                setWorkouts(response.data);
            } catch (error) {
                console.error('Ошибка получения тренировок:', error);
                setWorkouts([]);
            }
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadWorkouts();
        }, [refreshTrigger, id])
    );

    const handleGoBack = () => {
        router.back();
    };

    const handleUpdateClient = async () => {
        if (!newName.trim()) {
            Alert.alert('Ошибка','Введите имя клиента');
            return;
        }

        const success = await updateClient(id, {
            name: newName,
            contact: newContact
        });

        if (success) {
            setCurrentName(newName);
            setCurrentContact(newContact);
            setModalVisible(false);
            triggerRefresh();
            Alert.alert('Успех', 'Данные клиента обновлены');
        } else {
            Alert.alert('Ошибка', 'Не удалось обновить данные клиента');
        }
    };

    const handleAddWorkout = () => {
        router.push({
            pathname: '/add-workout',
            params: { clientId: id.toString(), clientName: currentName }
        });
    };

    const handleWorkoutPress = (workout: any) => {
        router.push({
            pathname: '/workout-info',
            params: {
                id: workout.id,
                name: workout.name_workout,
                date: workout.date,
            }
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)}`;
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>← Назад</Text>
                </TouchableOpacity>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#AACC12" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>

            <View style={styles.containerInfo}>
                <View style={styles.containerInfoClient}>
                    <Text style={styles.textName}>{currentName}</Text>
                    <Text style={styles.textContact}>{currentContact}</Text>
                </View>

                <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
                    <MaterialCommunityIcons style={styles.iconoutline} name="brush-outline"/>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setNewName(currentName);
                    setNewContact(currentContact);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(false);
                                setNewName(currentName);
                                setNewContact(currentContact);
                            }}
                        >
                            <MaterialCommunityIcons name="close" size={24} color="#AACC12" />
                        </TouchableOpacity>

                        <View style={styles.containerModal}>
                            <Text style={styles.textNameModal}>Введите новое имя</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Имя"
                                placeholderTextColor="#646464"
                                value={newName}
                                onChangeText={setNewName}
                            />

                            <Text style={styles.textNameModal}>Введите новые контактные данные</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Контакт"
                                placeholderTextColor="#646464"
                                value={newContact}
                                onChangeText={setNewContact}
                            />

                            <TouchableOpacity onPress={handleUpdateClient} style={styles.saveButton}>
                                <Text style={styles.saveText}>Сохранить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Text style={styles.textTren}>Тренировки</Text>

            <TouchableOpacity style={styles.buttonAddTraining} onPress={handleAddWorkout}>
                <View style={styles.buttonContent}>
                    <Text style={styles.textplus}>Добавить тренировку</Text>
                    <MaterialCommunityIcons style={styles.iconplus} name="plus"/>
                </View>
            </TouchableOpacity>

            {workouts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Нет тренировок</Text>
                </View>
            ) : (
                workouts.map((workout) => (
                    <TouchableOpacity
                        key={workout.id}
                        style={styles.containerTraining}
                        onPress={() => handleWorkoutPress(workout)}
                    >
                        <Text style={styles.textTrainingName}>{workout.name_workout}</Text>
                        <Text style={styles.textTrainingDate}>Дата: {formatDate(workout.date)}</Text>
                    </TouchableOpacity>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 1,
        padding: 10,
    },
    backButtonText: {
        color: '#AACC12',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        backgroundColor: '#AACC12',
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconoutline: {
        color: '#000000',
        fontSize: 34,
    },
    containerInfo: {
        marginLeft: 25,
        marginTop: 90,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerInfoClient: {
        backgroundColor: '#AACC12',
        width: 300,
        height: 60,
        borderRadius: 20,
        padding: 8,
    },
    textName: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 5,
        color: '#000000',
    },
    textContact: {
        color: '#646464',
        fontSize: 13,
        marginLeft: 5,
    },

    textTren: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: '600',
        marginTop: 20,
        textAlign: 'center',
    },
    buttonAddTraining: {
        display: 'flex',
        backgroundColor: '#181818',
        width: '80%',
        height: 55,
        padding: 10,
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
    },
    textplus: {
        color: '#646464',
        fontSize: 20,
    },
    iconplus: {
        color: '#646464',
        fontSize: 25,
    },

    containerTraining: {
        marginTop: 20,
        backgroundColor: '#181818',
        width: '90%',
        height: 80,
        borderRadius: 20,
        padding: 10,
        alignSelf: 'center',
    },
    textTrainingName: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 5,
        marginLeft: 5,
    },
    textTrainingDate: {
        color: '#646464',
        fontSize: 14,
        marginTop: 3,
        marginLeft: 5,
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
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
        height: '55%',
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
    textNameModal: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#0e0e0e',
        width: '100%',
        height: 50,
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
        color: '#646464',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#AACC12',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 90,
    },
    saveText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});