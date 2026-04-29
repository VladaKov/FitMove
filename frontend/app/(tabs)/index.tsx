import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons  } from '@expo/vector-icons';
import { getUserName } from '../../services/auth';

import { useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import api from '../../services/api';
import { getUserId } from '../../services/auth';

export default function Home() {
    const router = useRouter();
    const { refreshTrigger, triggerRefresh } = useAppContext();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [trainings, setTrainings] = useState<any[]>([]);

    const getFormattedDate = () => {
        const now = new Date();
        const day = now.getDate();
        const monthNames = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        const month = monthNames[now.getMonth()];
        return `${day} ${month}`;
    };

    const loadData = async () => {
        setLoading(true);
        const name = await getUserName();
        setUserName(name || 'Пользователь');
        
        setCurrentDate(getFormattedDate());
        
        const userId = await getUserId();
        if (userId) {
            try {
                const response = await api.get(`/workout/user/${userId}`);
                const workouts = response.data;
                const workoutsWithoutClient = workouts.filter((workout: any) => workout.id_client === null);
                const sortedWorkouts = workoutsWithoutClient.sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setTrainings(sortedWorkouts.slice(0, 3));
            } catch (error) {
                console.error('Ошибка получения тренировок:', error);
                setTrainings([]);
            }
        }
        
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [refreshTrigger])
    );

    const handlePressTrainings = () => {
        router.push('/(page)/client');
    };

    const handleAddTraining = () => {
        router.push({
            pathname: '/(page)/userCreateTrainind',
            params: { userId: '' }
        });
    };

    const handleThemeSwitch = () => {
        console.log('Смена темы');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}.${month}.${year}`;
    };

    const handleDeleteTraining = async (trainingId: number, trainingName: string) => {
        Alert.alert(
            'Удалить тренировку',
            `Вы уверены, что хотите удалить тренировку "${trainingName}"?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const blocksResponse = await api.get(`/block_exercises/${trainingId}`);
                            const blocks = blocksResponse.data;
                            
                            for (const block of blocks) {
                                const exercisesResponse = await api.get(`/exercise/block/${block.id}`);
                                const exercises = exercisesResponse.data;
                                
                                for (const exercise of exercises) {
                                    await api.delete(`/exercise/${exercise.id}`);
                                }
                                
                                await api.delete(`/block_exercises/${block.id}`);
                            }
                            
                            await api.delete(`/workout/${trainingId}`);
                            triggerRefresh();
                            Alert.alert('Успех', 'Тренировка удалена');
                        } catch (error) {
                            console.error('Ошибка удаления тренировки:', error);
                            Alert.alert('Ошибка', 'Не удалось удалить тренировку');
                        }
                    }
                }
            ]
        );
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

            <View style={style.containerInfo}>

                <View style={style.containerInfoText}>
                    <Text style={style.textGreetings}>Привет, {userName}</Text>
                    <Text style={style.textGreetingsDate}>{currentDate}</Text>
                </View>

                <TouchableOpacity onPress={handleThemeSwitch} style={style.iconButton}>
                    <MaterialCommunityIcons style={style.iconbrightness_4} name="brightness-4"/>
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

            <Text style={style.textTraining}>Ваши тренировки</Text>

            {trainings.length === 0 ? (
                <Text style={style.textNoTrainings}>Нет тренировок</Text>
            ) : (
                trainings.map((training) => (
                    <View key={training.id} style={style.trainingContainer}>
                        <TouchableOpacity 
                            style={style.trainingContent}
                            onPress={() => {
                                router.push({
                                    pathname: '/(page)/clientTraining',
                                    params: {
                                        workoutId: training.id.toString(),
                                        name: training.name_workout,
                                        date: training.date,
                                    }
                                });
                            }}
                        >
                            <View style={style.trainingTextContainer}>
                                <Text style={style.textTrainingName}>{training.name_workout}</Text>
                                <Text style={style.textTrainingDate}>Дата: {formatDate(training.date)}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={style.deleteButton}
                            onPress={() => handleDeleteTraining(training.id, training.name_workout)}
                        >
                            <MaterialCommunityIcons name="delete" size={24} color="#ff4444" />
                        </TouchableOpacity>
                    </View>
                ))
            )}

            <TouchableOpacity onPress={handleAddTraining} style={style.buttonAddTraining}>
                <View style={style.buttonContent}>
                    <Text style={style.textplus}>Добавить тренировку</Text>
                    <MaterialCommunityIcons style={style.iconplus} name="plus"/>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#0e0e0e',
        flex: 1,
    },
    containerInfo: {
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconbrightness_4: {
        color: '#646464',
        fontSize: 36,
    },
    containerMotivation: {
        marginTop: 40,
        height: 200,
        width: '90%',
        backgroundColor: '#181818',
        borderRadius: 20,
        alignSelf: 'center'
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
    },
    textTraining: {
        color: '#AACC12',
        fontSize: 26,
        fontWeight: 700,
        marginTop: 30,
        textAlign: 'center',
    },
    trainingContainer: {
        marginTop: 20,
        backgroundColor: '#181818',
        width: '90%',
        minHeight: 80,
        borderRadius: 20,
        padding: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    trainingContent: {
        flex: 1,
    },
    trainingTextContainer: {
        flex: 1,
    },
    textTrainingName: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 700,
        marginTop: 5,
        marginLeft: 5,
    },
    textTrainingDate: {
        color: '#646464',
        fontSize: 14,
        marginTop: 3,
        marginLeft: 5,
    },
    textNoTrainings: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 500,
    },
    deleteButton: {
        padding: 8,
        marginRight: 5,
    },
    buttonAddTraining: {
        display: 'flex',
        backgroundColor: '#AACC12',
        width: '80%',
        height: 50,
        padding: 10,
        marginTop: 40,
        marginBottom: 20,
        borderRadius: 30,
        justifyContent: 'center',
        alignSelf: 'center'
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
});