import api from './api';
import {ClientCreate, ClientUpdate, ClientResponse}  from './types';

export const createClient = async (client: ClientCreate) => {
    const response = await api.post('/clients', client);
    return response.data;
}
export const updateClient = async (id: number, client: ClientUpdate) => {
    const response = await api.patch(`/clients/${id}`, client);
    return response.data;
}

export const getClients = async (userId: number): Promise<ClientResponse[]> => {
    const response = await api.get(`/clients/user/${userId}`);
    return response.data;
};

export const deleteClient = async (id: number) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
}