import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";

import React, { useState, useEffect, useCallback } from "react";
import FilterModal from "@/components/FilterModal";
import * as Location from "expo-location";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";

export default function HomeScreen() {
  // ---------------- STATE ----------------
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("house");
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [bedrooms, setBedrooms] = useState("");
  const [bedspaces, setBedspaces] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  // feed states
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [listings, setListings] = useState([]);

  const [logoTapCount, setLogoTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  // ---------------- RESET ----------------
  const handleReset = () => {
    setLocation("");
    setFilter("");
    setLat(null);
    setLon(null);
    setBedrooms("");
    setBedspaces("");
    setPrice("");
    setError("");
  };

  // ---------------- SECRET ADMIN TAP ----------------
  const handleLogoTap = () => {
    const now = Date.now();

    if (now - lastTapTime > 2000) {
      setLogoTapCount(1);
    } else {
      setLogoTapCount((prev) => prev + 1);
    }

    setLastTapTime(now);

    if (logoTapCount + 1 === 37) {
      router.push("/screens/adminloginscreen");
      setLogoTapCount(0);
    }
  };

  // ---------------- RESET WHEN RETURNING ----------------
  useFocusEffect(
    useCallback(() => {
      setLocation("");
      setFilter("");
      setLat(null);
      setLon(null);
      setBedrooms("");
      setBedspaces("");
      setPrice("");
      setError("");
    }, [])
  );

  // ---------------- NEAR ME ----------------
  useEffect(() => {
    if (filter === "near-me") {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = locationData.coords;

        setLat(latitude);
        setLon(longitude);

        const label =
          propertyType === "boardinghouse"
            ? "Boarding houses near me"
            : "Houses near me";

        setLocation(label);
      })();
    }
  }, [filter, propertyType]);

  // ---------------- SEARCH ----------------
  const HandleSearch = () => {
    if (!location && filter !== "near-me") {
      alert("Please enter a location or select 'Near Me'");
      return;
    }

    setLoading(true);
    setError("");

    const queryObject = {
      lat,
      lon,
      location,
      property_type: propertyType,
      ...(filter === "near-me" ? { use_coordinates: true } : {}),
      ...(propertyType === "house" ? { bedrooms, price } : {}),
      ...(propertyType === "boardinghouse"
        ? { bed_spaces: bedspaces, price }
        : {}),
    };

    const queryParams = Object.entries(queryObject)
      .filter(([_, v]) => v !== null && v !== "" && v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    fetch(`${baseURL}/api/searchproperty?${queryParams}`)
      .then((res) => res.json())
      .then((data) => {
        router.push({
          pathname: "/screens/ResultsScreen",
          params: { results: JSON.stringify(data) },
        });
      })
      .catch(() => setError("Search failed. Try again."))
      .finally(() => setLoading(false));
  };

  
  const fetchFeed = async () => {
    try {
      setFeedLoading(true);
      setFeedError("");

      const res = await fetch(`${baseURL}/api/homefeed`);
      const data = await res.json();

      setListings(data);
    } catch (err) {
      setFeedError("Failed to load listings");
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // ---------------- CARD ----------------
  const renderItem = ({ item }) => {
    const cover = item.images?.[0];

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/propertydetails",
            params: { property: JSON.stringify(item) },
          })
        }
      >
        <View style={styles.cardItem}>
          {cover ? (
            <Image source={cover} style={styles.image} contentFit="cover" />
          ) : (
            <View style={styles.noImage}>
              <Text>No Image</Text>
            </View>
          )}

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.price}>K{item.price}/month</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ---------------- UI ----------------
  return (
    <KeyboardAvoidingView style={styles.container}>
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        price={price}
        setPrice={setPrice}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        bedspaces={bedspaces}
        setBedspaces={setBedspaces}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        filter={filter}
        setFilter={setFilter}
        handleReset={handleReset}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.inner}>
          {/* HEADER */}
          <View style={styles.topsection}>
            <TouchableOpacity onPress={handleLogoTap}>
              <Text style={styles.header}>ZamRent</Text>
            </TouchableOpacity>
          </View>

          {/* SEARCH CARD */}
          <View style={styles.card}>
            <TextInput
              style={styles.inputField}
              value={location}
              onChangeText={setLocation}
              placeholder="Search location or property..."
              placeholderTextColor="gray"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1 }]}
                onPress={HandleSearch}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Search</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1, marginLeft: 5 }]}
                onPress={() => setFilterVisible(true)}
              >
                <Text style={styles.secondaryButtonText}>Filters</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FEED */}
          {feedLoading ? (
            <ActivityIndicator size="large" />
          ) : feedError ? (
            <Text style={{ textAlign: "center" }}>{feedError}</Text>
          ) : (
            <FlatList
              data={listings}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  inner: { flex: 1, padding: 10 },

  topsection: { alignItems: "center", marginBottom: 10 },

  header: { fontSize: 32, fontWeight: "bold", color: "#2a2a72" },

  subheader: { fontSize: 16, color: "gray", textAlign: "center", marginTop: 6 },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 1,
    marginBottom: 5,
    elevation: 3,
  },

  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  buttonRow: { flexDirection: "row", marginTop: 0 },

  primaryButton: {
    backgroundColor: "#2a2a72",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryButton: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { color: "white", fontWeight: "600" },
  secondaryButtonText: { color: "#2a2a72", fontWeight: "600" },

  cardItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },

  image: { width: "100%", height: 180, borderRadius: 10 },

  noImage: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  title: { fontSize: 18, fontWeight: "bold", marginTop: 8 },

  location: { color: "gray", marginTop: 2 },

  price: { marginTop: 6, fontWeight: "600" },
});
