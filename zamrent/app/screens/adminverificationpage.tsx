import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminVerificationsScreen() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async (query = "") => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("adminToken");

      const url =
        query.trim().length > 0
          ? `${baseURL}/api/admin/property-verifications?q=${encodeURIComponent(query)}`
          : `${baseURL}/api/admin/property-verifications`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Here is what we received ", data)
      setVerifications(data);
    } catch (err) {
      console.error("Fetch verifications error:", err);
      Alert.alert("Error", "Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchVerifications(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchVerifications();
  };

  const approveVerification = async (id: string) => {
    setVerifications((prev) =>
      prev.filter((v) => v.verification.id !== id)
    );

    try {
      const token = await AsyncStorage.getItem("adminToken");
      await fetch(`${baseURL}/api/admin/property-verifications/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      Alert.alert("Error", "Approval failed");
      fetchVerifications(searchQuery);
    }
  };

  const rejectVerification = async (id: string) => {
    setVerifications((prev) =>
      prev.filter((v) => v.verification.id !== id)
    );
    setRejectingId(null);
    setReason("");

    try {
      const token = await AsyncStorage.getItem("adminToken");
      await fetch(`${baseURL}/api/admin/property-verifications/${id}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });
    } catch {
      Alert.alert("Error", "Rejection failed");
      fetchVerifications(searchQuery);
    }
  };

  return (
    <View style={{ flex: 1 , paddingTop:25,}}>
      {/* SEARCH SECTION */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search by email or phone"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
        />

        <View style={styles.searchActions}>
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearSearch}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* RESULTS */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={verifications}
          keyExtractor={(item) => item.verification.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No pending verifications</Text>
          }
          renderItem={({ item }) => (
              <View style={styles.card}>
                {/* PROPERTY INFO */}
                {item.property ? (
                  <>
                    <Text style={styles.title}>{item.property.title}</Text>
                    <Text>{item.property.location}</Text>
                  </>
                ) : (
                  <Text style={{ color: "red", fontStyle: "italic" }}>
                    Property data missing
                  </Text>
                )}

                {/* VERIFICATION IMAGES */}
                <Text style={styles.section}>Verification Images</Text>
                <View style={styles.imageRow}>
                  {item.verification_images.map((img: any, i: number) => (
                    <Image
                      key={`ver-${i}`}
                      source={{ uri: img.image_url }}
                      style={styles.image}
                    />
                  ))}
                </View>

                {/* PROPERTY IMAGES */}
                {item.property_images && item.property_images.length > 0 && (
                  <>
                    <Text style={styles.section}>Property Images</Text>
                    <View style={styles.imageRow}>
                      {item.property_images.map((uri: string, i: number) => (
                        <Image
                          key={`prop-${i}`}
                          source={{ uri }}
                          style={styles.image}
                        />
                      ))}
                    </View>
                  </>
                )}

                {/* ACTIONS */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.approve]}
                    onPress={() => approveVerification(item.verification.id)}
                  >
                    <Text style={styles.btnText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.reject]}
                    onPress={() => setRejectingId(item.verification.id)}
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>

                {/* REJECTION BOX */}
                {rejectingId === item.verification.id && (
                  <View style={styles.rejectBox}>
                    <TextInput
                      placeholder="Optional rejection reason"
                      value={reason}
                      onChangeText={setReason}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={[styles.btn, styles.reject]}
                      onPress={() => rejectVerification(item.verification.id)}
                    >
                      <Text style={styles.btnText}>Confirm Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 40, color: "#777" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "600" },
  section: { marginTop: 10, fontWeight: "500" },

  imageRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  image: {
    width: 70,
    height: 70,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 4,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  approve: { backgroundColor: "#1abc9c" },
  reject: { backgroundColor: "#e74c3c" },
  btnText: { color: "#fff", fontWeight: "600" },

  rejectBox: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
});

