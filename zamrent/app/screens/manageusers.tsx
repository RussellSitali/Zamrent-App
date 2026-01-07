
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ManageUsersScreen() {

  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


    const handleSearch = async () => {
    const token = await AsyncStorage.getItem("adminToken"); 
    console.log("Token from users admin", token);
    
    if (!searchQuery.trim()) {
        alert("Please enter email or phone number");
        return;
    }

    try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${baseURL}/api/admin/user/search?q=${encodeURIComponent(searchQuery)}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
            },
        }
        );

        const data = await response.json();
        console.log("Data from admin user", data);

        if (!response.ok) {
        throw new Error(data.message || "Search failed");
        }

        setResults(data); 
    } catch (err) {
        setError(err.message);
        setResults(null);
    } finally {
        setLoading(false);
    }
    };


  return (
    <View style={styles.container}>

      {/* TOP: SEARCH SECTION */}
      <View style={styles.searchSection}>
        <Text style={styles.pageTitle}>Manage Users</Text>

        <TextInput
          style={styles.input}
          placeholder="Search by email or phone number"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.resultsSection}>
        {results.length === 0 ? (
          <Text style={styles.placeholderText}>
            Search results will appear here
          </Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {results.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <Text style={styles.userEmail}>Names: {user.first_name} {user.last_name}</Text>
                <Text style={styles.userPhone}>Email: {user.email}</Text>
                <Text style={styles.userPhone}>Phone number: {user.phone}</Text>
                <Text style={styles.userPhone}>Verification: {user.verification}</Text>
                <Text style={styles.userPhone}>Account Verified: {user.account_verified}</Text>
                <Text style={styles.userPhone}>DOB: {user.date_account_created}</Text>

                <Text
                  style={[
                    styles.status,
                    user.status === "banned"
                      ? styles.banned
                      : styles.active,
                  ]}
                >
                  Status: {user.status}
                </Text>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.banBtn}>
                    <Text style={styles.btnText}>Ban</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.unbanBtn}>
                    <Text style={styles.btnText}>Unban</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* SEARCH SECTION */
  searchSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2f95dc",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  searchBtn: {
    backgroundColor: "#2f95dc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  searchBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* RESULTS SECTION */
  resultsSection: {
    flex: 1,
    padding: 16,
  },

  placeholderText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 16,
  },

  userCard: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  userEmail: {
    fontWeight: "700",
    fontSize: 15,
  },

  userPhone: {
    marginTop: 4,
    color: "#555",
  },

  status: {
    marginTop: 6,
    fontWeight: "600",
  },

  active: {
    color: "#5cb85c",
  },

  banned: {
    color: "#d9534f",
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  banBtn: {
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },

  unbanBtn: {
    backgroundColor: "#5cb85c",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});
