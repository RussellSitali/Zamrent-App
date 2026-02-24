import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image 
} from "react-native";
import { Stack, useRouter } from "expo-router";
import CustomDrawer from "./tenantdrawer";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TenantView({ user }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");


  const isPremium = user?.subscription_status === "premium";

  return (
    <CustomDrawer>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Hello, {user?.first_name || "Tenant"}</Text>
          <Text style={styles.subText}>Find your next home around campus</Text>
          
          {isPremium ? (
            <View style={styles.premiumBadge}>
              <MaterialCommunityIcons name="star-circle" size={20} color="#FFD700" />
              <Text style={styles.premiumText}>Premium Early Access Active</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.upgradeCard} onPress={() => router.push("/screens/subscription")}>
              <Text style={styles.upgradeTitle}>Get 24h Early Access ⚡</Text>
              <Text style={styles.upgradeSub}>See new listings before everyone else.</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SEARCH & FILTERS SECTION */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={24} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Search by area or school..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {/* Action Buttons for Favorites & Messages */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/tenantscreens/favorite")}>
              <MaterialCommunityIcons name="heart" size={28} color="#e74c3c" />
              <Text style={styles.actionLabel}>Saved</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/tenantscreens/favorite")}>
              <MaterialCommunityIcons name="bell-badge" size={28} color="purple" />
              <Text style={styles.actionLabel}>Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/tenantscreens/favorite")}>
              <MaterialCommunityIcons name="chat" size={28} color="#3498db" />
              <Text style={styles.actionLabel}>Chats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 24-HOUR EARLY ACCESS PREVIEW (Your Strategy) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Newly Added (Early Access)</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/HomeScreen")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {!isPremium && (
          <View style={styles.lockedOverlay}>
            <MaterialCommunityIcons name="lock" size={40} color="rgba(0,0,0,0.3)" />
            <Text style={styles.lockedText}>These properties are currently visible to Premium users only. They will open for you in 24 hours.</Text>
          </View>
        )}

        {/* Small Business Ads Placeholder */}
        <Text style={styles.sectionTitle}>Campus Services</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adScroll}>
          <View style={styles.adCard}>
             <MaterialCommunityIcons name="truck-delivery" size={30} color="orange" />
             <Text style={styles.adText}>Swift Movers</Text>
          </View>
          <View style={styles.adCard}>
             <MaterialCommunityIcons name="laptop" size={30} color="blue" />
             <Text style={styles.adText}>Tech Repair</Text>
          </View>
        </ScrollView>

        <View style={{height: 100}} />
      </ScrollView>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfdfd", paddingHorizontal: 20 },
  headerSection: { marginTop: 80, marginBottom: 20 },
  welcomeText: { fontSize: 28, fontWeight: "bold", color: "#333" },
  subText: { fontSize: 16, color: "gray", marginTop: 5 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff8e1', padding: 10, borderRadius: 10, marginTop: 15, borderWidth: 1, borderColor: '#FFD700' },
  premiumText: { color: '#b8860B', fontWeight: 'bold', marginLeft: 8 },
  upgradeCard: { backgroundColor: 'purple', padding: 15, borderRadius: 12, marginTop: 15 },
  upgradeTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  upgradeSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  searchContainer: { marginVertical: 10 },
  searchBar: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 12, borderRadius: 12, alignItems: 'center' },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, backgroundColor: '#fff', paddingVertical: 15, borderRadius: 15, elevation: 2 },
  actionButton: { alignItems: 'center' },
  actionLabel: { marginTop: 5, fontSize: 12, fontWeight: '600', color: '#555' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  seeAll: { color: 'blue', fontWeight: '600' },
  lockedOverlay: { backgroundColor: '#f9f9f9', height: 150, borderRadius: 15, justifyContent: 'center', alignItems: 'center', padding: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#ddd' },
  lockedText: { textAlign: 'center', color: '#999', fontSize: 13, marginTop: 10 },
  adScroll: { marginTop: 10 },
  adCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginRight: 15, alignItems: 'center', elevation: 2, width: 120 },
  adText: { marginTop: 10, fontWeight: '600', fontSize: 12 }
});