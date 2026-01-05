import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // =============================
  // LIVE SEARCH WITH DEBOUNCE
  // =============================
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchBackend(query);
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  // =============================
  // API CALLS (COMMENTED)
  // =============================

  /*
  const searchBackend = async (text) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/admin/search?q=${text}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  */

  /*
  const banUser = async (userId) => {
    await fetch(`${API_URL}/admin/users/${userId}/ban`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  };
  */

  /*
  const unbanUser = async (userId) => {
    await fetch(`${API_URL}/admin/users/${userId}/unban`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  };
  */

  /*
  const deleteUser = async (userId) => {
    await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  };
  */

  /*
  const deleteListing = async (listingId) => {
    await fetch(`${API_URL}/admin/listings/${listingId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  };
  */

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ZamRent Admin</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/HomeScreen")}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search listings, email, phone, location..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading && <ActivityIndicator size="small" />}

      {/* Results */}
      {results.map((item) => (
        <View key={item.listing_id} style={styles.card}>
          {/* Listing Info */}
          <Text style={styles.listingTitle}>{item.title}</Text>
          <Text>Location: {item.location}</Text>
          <Text>Status: {item.listing_status}</Text>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text>User: {item.user_email}</Text>
            <Text>Phone: {item.user_phone}</Text>
            <Text>User Status: {item.user_status}</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.deleteListingBtn}>
              <Text style={styles.btnText}>Delete Listing</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.banBtn}>
              <Text style={styles.btnText}>Ban User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.unbanBtn}>
              <Text style={styles.btnText}>Unban User</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteUserBtn}>
              <Text style={styles.btnText}>Delete User</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {!loading && query.length > 0 && results.length === 0 && (
        <Text style={styles.emptyText}>No results found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2f95dc",
  },
  logout: {
    color: "red",
    fontWeight: "600",
  },
  searchBox: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  userInfo: {
    marginTop: 8,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  deleteListingBtn: {
    backgroundColor: "#d9534f",
    padding: 8,
    borderRadius: 6,
  },
  banBtn: {
    backgroundColor: "#f0ad4e",
    padding: 8,
    borderRadius: 6,
  },
  unbanBtn: {
    backgroundColor: "#5cb85c",
    padding: 8,
    borderRadius: 6,
  },
  deleteUserBtn: {
    backgroundColor: "#b52b27",
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
