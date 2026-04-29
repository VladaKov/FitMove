import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserId } from '../../services/auth';
import { createWorkout } from '../../services/workoutService';
import { createBlockExercise } from '../../services/blockExercisesService';
import { createExercise } from '../../services/exercisesService';
import { getCategories } from '../../services/categoryService';

export default function UserCreateTrainind() {
    const [workoutName, setWorkoutName] = useState('');
    const [blocks, setBlocks] = useState<any[]>([
        { id: '1', name: 'Блок 1', exercises: [] }
    ]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<{ blockId: string, exerciseId: string } | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    };

    const addBlock = () => {
        const newBlock = {
            id: Date.now().toString(),
            name: `Блок ${blocks.length + 1}`,
            exercises: []
        };
        setBlocks([...blocks, newBlock]);
    };

    const deleteBlock = (blockId: string) => {
        setBlocks(prevBlocks => {
            const filteredBlocks = prevBlocks.filter(block => block.id !== blockId);
            return filteredBlocks.map((block, index) => ({
                ...block,
                name: `Блок ${index + 1}`
            }));
        });
    };

    const addExercise = (blockId: string) => {
        const newExercise = {
            id: Date.now().toString(),
            category: '',
            categoryId: null as number | null,
            name: '',
            repetitions: '',
            comment: ''
        };
        setBlocks(blocks.map(block =>
            block.id === blockId
                ? { ...block, exercises: [...block.exercises, newExercise] }
                : block
        ));
    };

    const updateExercise = (blockId: string, exerciseId: string, field: string, value: any) => {
        setBlocks(prevBlocks => prevBlocks.map(block =>
            block.id === blockId
                ? {
                    ...block,
                    exercises: block.exercises.map((ex: any) =>
                        ex.id === exerciseId ? { ...ex, [field]: value } : ex
                    )
                }
                : block
        ));
    };

    const deleteExercise = (blockId: string, exerciseId: string) => {
        setBlocks(blocks.map(block =>
            block.id === blockId
                ? { ...block, exercises: block.exercises.filter((ex: any) => ex.id !== exerciseId) }
                : block
        ));
    };

    const openCategoryModal = (blockId: string, exerciseId: string) => {
        setSelectedExercise({ blockId, exerciseId });
        setModalVisible(true);
    };

    const selectCategory = (categoryId: number, categoryName: string) => {
        if (selectedExercise) {
            updateExercise(selectedExercise.blockId, selectedExercise.exerciseId, 'category', categoryName);
            updateExercise(selectedExercise.blockId, selectedExercise.exerciseId, 'categoryId', categoryId);
            setModalVisible(false);
            setSelectedExercise(null);
        }
    };

    const handleSave = async () => {
        if (!workoutName.trim()) {
            Alert.alert('Ошибка', 'Введите название тренировки');
            return;
        }

        setLoading(true);
        const userId = await getUserId();
        try {
            const workout = await createWorkout({
                id_users: userId || undefined,
                name_workout: workoutName,
                date: new Date().toISOString().split('T')[0]
            });

            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                const blockExercise = await createBlockExercise({
                    id_workout: workout.id,
                    number_block: i + 1
                });

                for (const exercise of block.exercises) {
                    if (exercise.name && exercise.repetitions) {
                        await createExercise({
                            id_block: blockExercise.id,
                            name_exercises: exercise.name,
                            repetitions: parseInt(exercise.repetitions),
                            comment: exercise.comment || '',
                            id_category: exercise.categoryId || undefined
                        });
                    }
                }
            }
            router.back();
        } catch (error: any) {
            console.error('Ошибка:', error);
            Alert.alert('Ошибка', `Не удалось создать тренировку: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backText}>← Назад</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Название тренировки</Text>
            <TextInput
                style={styles.input}
                placeholder="Название"
                placeholderTextColor="#646464"
                value={workoutName}
                onChangeText={setWorkoutName}
            />

            {blocks.map((block: any) => (
                <View key={block.id} style={styles.blockContainer}>
                    <View style={styles.blockHeader}>
                        <Text style={styles.blockTitle}>{block.name}</Text>
                        <TouchableOpacity onPress={() => deleteBlock(block.id)}>
                            <Text style={styles.deleteBlockText}>Удалить блок</Text>
                        </TouchableOpacity>
                    </View>

                    {block.exercises.map((ex: any) => (
                        <View key={ex.id} style={styles.exerciseCard}>
                            <TextInput
                                style={styles.exerciseName}
                                placeholder="Название упражнения"
                                placeholderTextColor="#646464"
                                value={ex.name}
                                onChangeText={(text) => updateExercise(block.id, ex.id, 'name', text)}
                            />

                            <TextInput
                                style={styles.commentInput}
                                placeholder="Комментарий"
                                placeholderTextColor="#646464"
                                value={ex.comment}
                                onChangeText={(text) => updateExercise(block.id, ex.id, 'comment', text)}
                                multiline
                            />

                            <View style={styles.exerciseRow}>
                                <TouchableOpacity
                                    style={styles.categoryWrapper}
                                    onPress={() => openCategoryModal(block.id, ex.id)}
                                >
                                    <TextInput
                                        style={[styles.exerciseCategory, ex.category && styles.exerciseCategorySelected]}
                                        placeholder="Категория"
                                        placeholderTextColor="#646464"
                                        value={ex.category}
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                    <MaterialCommunityIcons name="chevron-down" size={20} color="#646464" style={styles.dropdownIcon} />
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.exerciseRepetition}
                                    placeholder="Повторения"
                                    placeholderTextColor="#646464"
                                    keyboardType="numeric"
                                    value={ex.repetitions}
                                    onChangeText={(text) => updateExercise(block.id, ex.id, 'repetitions', text)}
                                />

                                <TouchableOpacity onPress={() => deleteExercise(block.id, ex.id)}>
                                    <MaterialCommunityIcons name="delete" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.addExerciseButton} onPress={() => addExercise(block.id)}>
                        <MaterialCommunityIcons name="plus" size={20} color="#AACC12" />
                        <Text style={styles.addExerciseText}>Добавить упражнение</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity style={styles.addBlockButton} onPress={addBlock}>
                <MaterialCommunityIcons name="plus" size={24} color="#AACC12" />
                <Text style={styles.addBlockText}>Добавить блок</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                <Text style={styles.saveButtonText}>{loading ? 'Сохранение...' : 'Сохранить'}</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSelectedExercise(null);
                }}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => {
                        setModalVisible(false);
                        setSelectedExercise(null);
                    }}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Выберите категорию</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedExercise(null);
                                }}
                            >
                                <MaterialCommunityIcons name="close" size={24} color="#AACC12" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalList}>
                            {categories.map((cat, index) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.modalItem, index === categories.length - 1 && styles.modalItemLast]}
                                    onPress={() => selectCategory(cat.id, cat.name_category)}
                                >
                                    <Text style={styles.modalItemText}>{cat.name_category}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e',
        padding: 20,
    },
    backButton: {
        marginTop: 50,
        marginBottom: 20,
    },
    backText: {
        color: '#AACC12',
        fontSize: 16,
    },
    title: {
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#181818',
        borderRadius: 15,
        padding: 15,
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 20,
    },
    addBlockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#181818',
        padding: 15,
        borderRadius: 30,
        gap: 10,
    },
    addBlockText: {
        color: '#AACC12',
        fontSize: 18,
        fontWeight: '600',
    },
    blockContainer: {
        marginBottom: 30,
        backgroundColor: '#181818',
        borderRadius: 20,
        padding: 15,
    },
    blockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    blockTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    deleteBlockText: {
        color: '#ff4444',
        fontSize: 14,
        fontWeight: '600',
    },
    exerciseCard: {
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    exerciseName: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        backgroundColor: '#0e0e0e',
        borderRadius: 10,
        padding: 10,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    categoryWrapper: {
        flex: 2,
        position: 'relative',
    },
    exerciseCategory: {
        color: '#ffffff',
        fontSize: 14,
        backgroundColor: '#0e0e0e',
        borderRadius: 10,
        padding: 10,
        paddingRight: 30,
    },
    exerciseCategorySelected: {
        color: '#646464',
        fontWeight: '600',
    },
    dropdownIcon: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    exerciseRepetition: {
        flex: 1,
        color: '#ffffff',
        fontSize: 14,
        backgroundColor: '#0e0e0e',
        borderRadius: 10,
        padding: 10,
    },
    commentInput: {
        color: '#646464',
        fontSize: 14,
        backgroundColor: '#0e0e0e',
        borderRadius: 10,
        padding: 10,
        minHeight: 40,
        marginBottom: 15,
    },
    addExerciseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    addExerciseText: {
        color: '#AACC12',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#AACC12',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#181818',
        borderRadius: 20,
        width: '85%',
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalList: {
        padding: 10,
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    modalItemLast: {
        borderBottomWidth: 0,
    },
    modalItemText: {
        color: '#ffffff',
        fontSize: 16,
    },
});