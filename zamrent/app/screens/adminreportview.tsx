
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function AdminReportsScreen() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("new"); // 'new' | 'viewed'
  const [loading, setLoading] = useState(true);

const router = useRouter();

    useEffect(() => {
    const init = async () => {
        const token = await AsyncStorage.getItem("adminToken");

        if (!token) {
        router.replace("/(tabs)/HomeScreen");
        return;
        }

        fetchReports();
    };

    init();
    }, []);


  const fetchReports = async () => {
    try {
     
      const token = await AsyncStorage.getItem("adminToken");

      if (!token) {
        router.replace("/(tabs)/HomeScreen");
        return;
      }

      const res = await fetch(`${baseURL}/api/admin/reports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.log("Error fetching reports", err);
    } finally {
      setLoading(false);
    }
  };


    const markAsViewed = async (reportId) => {
      try {
        const token = await AsyncStorage.getItem("adminToken");

        if (!token) {
          console.log("No admin token found");
          return;
        }

        await fetch(`${baseURL}/api/admin/reports/${reportId}/viewed`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });

        // Update local state
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId ? { ...r, status: "viewed" } : r
          )
        );
      } catch (err) {
        console.log("Failed to mark report as viewed", err);
      }
    };


  const filteredReports = reports.filter(
    (r) => r.status === filter
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports</Text>

      {/* Filter Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            filter === "new" && styles.activeBtn,
          ]}
          onPress={() => setFilter("new")}
        >
          <Text
            style={[
              styles.toggleText,
              filter === "new" && styles.activeText,
            ]}
          >
            New
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleBtn,
            filter === "viewed" && styles.activeBtn,
          ]}
          onPress={() => setFilter("viewed")}
        >
          <Text
            style={[
              styles.toggleText,
              filter === "viewed" && styles.activeText,
            ]}
          >
            Viewed
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView>
          {filteredReports.length === 0 ? (
            <Text style={styles.emptyText}>No reports here.</Text>
          ) : (
            filteredReports.map((report) => (
              <View key={report.id} style={styles.card}>
                <Text style={styles.bold}>
                  Listing ID:{" "}
                  <Text style={styles.normal}>{report.listing_id}</Text>
                </Text>

                <Text style={styles.bold}>
                  Landy's phone#:{" "}
                  <Text style={styles.normal}>{report.owner_phone}</Text>
                </Text>

                <Text style={styles.bold}>
                  Reporter:{" "}
                  <Text style={styles.normal}>
                    {report.reporter_name} ({report.reporter_phone})
                  </Text>
                </Text>

                {report.reason ? (
                  <Text style={styles.bold}>
                    Reason:{" "}
                    <Text style={styles.normal}>{report.reason}</Text>
                  </Text>
                ) : null}

                <Text style={styles.message}>{report.message}</Text>

                <Text style={styles.date}> DateReportSent: 
                  {new Date(report.created_at).toLocaleString()}
                </Text>

                {report.status === "new" && (
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => markAsViewed(report.id)}
                  >
                    <Text style={styles.viewText}>
                      Mark as viewed
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginRight: 5,
    alignItems: "center",
  },
  activeBtn: {
    backgroundColor: "#2f95dc",
  },
  toggleText: {
    color: "#333",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  bold: {
    fontWeight: "700",
  },
  normal: {
    fontWeight: "400",
  },
  message: {
    marginTop: 8,
    fontSize: 15,
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
  viewBtn: {
    marginTop: 10,
    backgroundColor: "#2f95dc",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  viewText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});


// Work on to show which stuff have already been viewed
