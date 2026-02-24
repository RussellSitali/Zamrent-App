
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          router.replace("/(tabs)/SignInScreen");
          return;
        }

        const storedFavs = await AsyncStorage.getItem("favorites");
        setFavorites(storedFavs ? JSON.parse(storedFavs) : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (id) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No favorites yet ❤️</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>K{item.price}</Text>

            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20 },
  center:{ flex:1, justifyContent:"center", alignItems:"center" },

  card:{
    backgroundColor:"#fff",
    padding:15,
    borderRadius:10,
    marginBottom:12,
    elevation:3
  },

  title:{ fontSize:18, fontWeight:"bold" },
  remove:{ color:"red", marginTop:8 }
});