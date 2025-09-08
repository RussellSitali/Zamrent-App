import React, { useState } from "react";
import { 
  View, Text, Animated, Dimensions, TouchableOpacity, StyleSheet} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function CustomDrawer({ children }) {
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

      {/* Overlay for tapping outside */}
      {menuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {/* Drawer Menu */}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <Text style={styles.menuItem} onPress={() => router.push("/(tabs)/Profile")}>
          📊 Dashboard
        </Text>
        <Text style={styles.menuItem} onPress={() => router.push("/screens/addlisting")}>
          ➕ Add Listing
        </Text>
        <Text style={styles.menuItem} onPress={() => router.push("/screens/profilepayments")}>
          👤 Profile
        </Text>
        <Text style={[styles.menuItem, { color: "red" }]} onPress={handleLogout}>
          🚪 Logout
        </Text>
      </Animated.View>

      {/* Screen Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "white",
    paddingTop: 60,
    paddingLeft: 20,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    fontSize: 20,
    marginBottom: 20,
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
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
});
