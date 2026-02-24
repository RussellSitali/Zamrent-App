
import React, { useState } from "react";
import { 
  View, Text, Animated, Dimensions, TouchableOpacity, StyleSheet 
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function TenantDrawer({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width))[0];

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userInfo");
    router.replace("/(tabs)/HomeScreen");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Hamburger Icon */}
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
        <Text style={styles.hamburgerText}>≡</Text>
      </TouchableOpacity>

      {/* Overlay */}
      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {/* Drawer Menu */}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <Text style={styles.menuTitle}>ZamRent Tenant</Text>
        
        <TouchableOpacity onPress={() => { toggleMenu(); router.push("/(tabs)/Profile"); }}>
          <Text style={styles.menuItem}>🏠 My Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { toggleMenu(); router.push("/tenantscreens/favorite"); }}>
          <Text style={styles.menuItem}>❤️ Saved Properties</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { toggleMenu(); router.push("/tenantscreens/favorite"); }}>
          <Text style={styles.menuItem}>🔔 Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { toggleMenu(); router.push("/tenantscreens/favorite"); }}>
          <Text style={styles.menuItem}>⚙️ Account Settings</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.menuItem, { color: "red" }]}>🚪 Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* This renders your TenantView content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "white",
    paddingTop: 60,
    paddingLeft: 20,
    elevation: 10,
    zIndex: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "purple",
  },
  menuItem: {
    fontSize: 18,
    marginBottom: 25,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
    marginRight: 20,
  },
  hamburger: {
    position: "absolute",
    top: 24,
    left: 13,
    zIndex: 11,
  },
  hamburgerText: {
    fontSize: 45,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 15,
  },
});