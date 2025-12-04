import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect,useCallback  } from "react";
import { Provider as PaperProvider, Button } from "react-native-paper";
import RadioButtons from "../../components/RadioButtons";
import FilterModal from "@/components/FilterModal";
import * as Location from "expo-location";
import { useRouter, useFocusEffect } from "expo-router";

export default function HomeScreen() {
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
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);


  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

   const handleReset = () => {
      setLocation("");
      setFilter("");
      setLat(null);
      setLon(null);
      setBedrooms("");
      setBedspaces("");
      setPrice("");
      setError("");
    }

    const handleLogoTap = () => {
      const now = Date.now();
      if (now - lastTapTime > 2000) { // Reset if more than 2 sec since last tap
        setLogoTapCount(1);
      } else {
        setLogoTapCount(prev => prev + 1);
      }
      setLastTapTime(now);

      if (logoTapCount + 1 === 13) {
        router.push("/screens/adminloginscreen"); // Navigate to admin login
        setLogoTapCount(0); // reset
      }
    };

useFocusEffect(
      useCallback(() => {
        // Reset everything when HomeScreen regains focus
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

  useEffect(() => {
    if (filter === "near-me") {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({});
        const { latitude, longitude, accuracy } = locationData.coords;

        setLat(latitude);
        setLon(longitude);

        console.log("These are the coords (lat,lon): ", latitude, longitude);

        const label =
          propertyType === "boardinghouse"
            ? "Boarding houses near me"
            : "Houses near me";

        setLocation(label);

        if (accuracy > 100) {
          alert(
            "Note: Your location accuracy is low. Consider enabling high accuracy mode."
          );
        }
      })();
    }
  }, [filter, propertyType]);

  const HandleSearch = () => {
    if (!location && filter !== "near-me") {
      alert("Please enter a location or select 'Near Me'");
      return;
    }

    setLoading(true);
    setError("");
    setLocation("");

    const queryObject = {
      lat,
      lon,
      location,
      property_type: propertyType,
      ...(filter === "near-me" ? { use_coordinates: true } : {}),
      ...(propertyType === "house" ? { bedrooms, price } : {}),
      ...(propertyType === "boardinghouse" ? { bed_spaces:bedspaces, price } : {}),
    };

    const queryParams = Object.entries(queryObject)
      .filter(([key, value]) => value !== null && value !== "" && value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    fetch(`${baseURL}/api/searchproperty?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Search results:", data);
        router.push({
          pathname: "/screens/ResultsScreen",
          params: {
            results: JSON.stringify(data),
          },
        });
      })
      .catch((err) => {
        console.error("Search failed:", err);
        setError("Search failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.inner}>
          {/* Top Section */}
          <View style={styles.topsection}>
            <TouchableOpacity onPress={handleLogoTap}>
              <Text style={styles.header}>ZamRent 🏠</Text>
            </TouchableOpacity>

            <Text style={styles.subheader}>
              Easily find and list rental properties across Zambia
            </Text>
          </View>

          {/* Search Card */}
          <View style={styles.card}>
            <TextInput
              style={styles.inputField}
              value={location}
              onChangeText={setLocation}
              placeholder="Search location..."
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
                style={[styles.secondaryButton, { flex: 1, marginLeft: 10 }]}
                onPress={() => setFilterVisible(true)}
              >
                <Text style={styles.secondaryButtonText}>Filters</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              <Button
                mode="contained-tonal"
                onPress={() => setFilter("near-me")}
                style={{ flex: 1, marginRight: 5 }}
              >
                Near Me
              </Button>
              <Button
                mode="outlined"
                onPress={handleReset}
                style={{ flex: 1, marginLeft: 5 }}
              >
                Reset
              </Button>
            </View>
          </View>

          {/* Property Type Selector */}
          <PaperProvider>
            <View style={styles.radioContainer}>
              <Text style={styles.sectionTitle}>Property Type</Text>
              <RadioButtons
                propertyType={propertyType}
                setPropertyType={setPropertyType}
              />
            </View>
          </PaperProvider>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  inner: {
    flex: 1,
    padding: 16,
  },
  topsection: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2a2a72",
  },
  subheader: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 20,
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#2a2a72",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#2a2a72",
    fontSize: 16,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  radioContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
