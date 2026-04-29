import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="clientInfo" />
            <Stack.Screen name="clientTraining" />
            <Stack.Screen name="clientCreateTrainind" />
            <Stack.Screen name="userCreateTrainind" />
        </Stack>
    );
}