import React, { useState, useCallback } from "react";
import { SafeAreaView, Text, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import LandlordView from "../../components/LandlordView";
import TenantView from "../../components/TenantView";

export default function ProfileRoute() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          const storedUser = await AsyncStorage.getItem("userInfo");

          if (!token || !storedUser) {
            setUser(null); 
            router.replace("/(tabs)/SignInScreen");
            return;
          }

          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Auth guard error:", err);
          router.replace("/(tabs)/SignInScreen");
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
      
      return () => {}; 
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="purple" />
      </SafeAreaView>
    );
  }


  if (!user || !user.role) {
    return null; 
  }

  return (
    <View style={{ flex: 1 }}>
      {user.role === "landlord" ? (
        <LandlordView user={user} />
      ) : (
        <TenantView user={user} />
      )}
    </View>
  );
}