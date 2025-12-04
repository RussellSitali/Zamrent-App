
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function GoodbyeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Account Has Been Deleted</Text>

            <Text style={styles.subtitle}>
                We're sad to see you go.  
                If you ever change your mind, you're always welcome back.
            </Text>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => router.replace("/(tabs)/HomeScreen")}
            >
                <Text style={styles.buttonText}>Return to Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        backgroundColor: "#ffffff",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#444",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        elevation: 2,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
