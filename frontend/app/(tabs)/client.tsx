import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';

import { getClients } from '../../services/clientsService';
import { ClientResponse } from '../../services/types';

export default function Client() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [clients, setClients] = useState<ClientResponse[]>([]);

    useEffect(() => {
        getClients(35).then(setClients);
    }, []);

    return (
        <View style={style.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={style.iconButton}>
                <View style={style.buttonContent}>
                    <Text style={style.textplus}>Добавить клиента</Text>
                    <MaterialCommunityIcons style={style.iconplus} name="plus" />
                </View>
            </TouchableOpacity>

            <FlatList
                data={clients}
                keyExtractor={(item) => item.id.toString()}
                style={{ width: '100%' }}
                renderItem={({ item }) => (
                    <View style={style.containerClient}>
                        <Text style={style.textNameClient}>{item.name}</Text>
                        <Text style={style.textDateClient}>был(а): 23.02.26</Text>
                    </View>
                )}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={style.modalOverlay}>
                    <View style={style.modalContent}>
                        <TouchableOpacity style={style.closeButton} onPress={() => setModalVisible(false)}>
                            <MaterialCommunityIcons name="close" size={24} color="#AACC12" />
                        </TouchableOpacity>

                        <View style={style.containerModalClient}>
                            <Text style={style.textNameClient}>Введите имя клиента</Text>
                            <TextInput style={style.inputClient} placeholder="Фио" placeholderTextColor="#646464" />
                            <Text style={style.textNameClient}>Введите контактные данные клиента</Text>
                            <TextInput style={style.inputClient} placeholder="Контакт" placeholderTextColor="#646464" />

                            <TouchableOpacity onPress={() => setModalVisible(false)} style={style.saveButton}>
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
    containerClient: {
        backgroundColor: '#181818',
        width: '100%',
        minHeight: 90,
        marginTop: 20,
        borderRadius: 20,
        padding: 15,
    },
    textNameClient: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 5,
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
    saveButton: {
        display: 'flex',
        backgroundColor: '#AACC12',
        width: '100%',
        height: 50,
        padding: 10,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 40,
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
});