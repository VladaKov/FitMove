import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../../services/api';

export default function ClientTraining() {
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [blocks, setBlocks] = useState<any[]>([]);

    const workoutId = params.workoutId as string;
    const workoutName = params.name as string;

    useEffect(() => {
        if (workoutId) {
            loadWorkoutData();
        } else {
            setLoading(false);
        }
    }, [workoutId]);

    const loadWorkoutData = async () => {
        try {
            const blocksResponse = await api.get(`/block_exercises/${workoutId}`);
            const blocksData = blocksResponse.data;
            
            const blocksWithExercises = await Promise.all(
                blocksData.map(async (block: any) => {
                    const exercisesResponse = await api.get(`/exercise/block/${block.id}`);
                    
                    const exercisesWithCategory = await Promise.all(
                        exercisesResponse.data.map(async (exercise: any) => {
                            let categoryName = 'Без категории';
                            if (exercise.id_category) {
                                try {
                                    const categoryResponse = await api.get(`/category/${exercise.id_category}`);
                                    categoryName = categoryResponse.data.name_category;
                                } catch (err) {
                                    console.error('Ошибка загрузки категории:', err);
                                }
                            }
                            return {
                                ...exercise,
                                category_name: categoryName
                            };
                        })
                    );
                    
                    return {
                        ...block,
                        exercises: exercisesWithCategory
                    };
                })
            );
            
            setBlocks(blocksWithExercises);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>← Назад</Text>
                </TouchableOpacity>
                <ActivityIndicator size="large" color="#AACC12" style={styles.loader} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{workoutName || 'Тренировка'}</Text>

            {blocks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Нет упражнений</Text>
                </View>
            ) : (
                blocks.map((block: any, blockIndex: number) => (
                    <View key={block.id} style={styles.blockWrapper}>
                        <Text style={styles.blockTitle}>Блок {block.number_block || blockIndex + 1}</Text>
                        
                        {block.exercises.map((exercise: any, exIndex: number) => (
                            <View key={exercise.id}>
                                <View style={styles.exerciseCard}>
                                    <Text style={styles.exerciseName}>{exercise.name_exercises}</Text>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.categoryText}>{exercise.category_name}</Text>
                                        <Text style={styles.repetitionsText}>{exercise.repetitions} повторений</Text>
                                    </View>
                                    {exercise.comment ? (
                                        <Text style={styles.commentText}>{exercise.comment}</Text>
                                    ) : null}
                                </View>
                                {exIndex !== block.exercises.length - 1 && <View style={styles.separator} />}
                            </View>
                        ))}
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e',
        paddingHorizontal: 20,
    },
    backButton: {
        marginTop: 60,
        marginBottom: 10,
        width: 80,
        height: 40,
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#AACC12',
        fontSize: 16,
        fontWeight: '600',
    },
    loader: {
        marginTop: 50,
    },
    title: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#646464',
        fontSize: 16,
    },
    blockWrapper: {
        backgroundColor: '#181818',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20
    },
    blockTitle: {
        color: '#AACC12',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 15,
    },
    exerciseCard: {
        marginBottom: 8,
    },
    exerciseName: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryText: {
        color: '#ffffff',
        fontSize: 14,
    },
    repetitionsText: {
        color: '#d1d1d1',
        fontSize: 14,
    },
    commentText: {
        color: '#a4a4a4',
        fontSize: 14,
        marginTop: 4,
        fontStyle: 'italic',
    },
    separator: {
        height: 1,
        backgroundColor: '#2a2a2a',
        marginVertical: 12,
    },
});