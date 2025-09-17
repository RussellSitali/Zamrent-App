import React, { useState, useEffect ,useCallback } from "react";
import { 
  View, Text, SafeAreaView, FlatList, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, TextInput 
} from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CustomDrawer from "../../components/drawer";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Profile() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [info, setInfo] = useState({ houses: [], boarding_houses: [] });
  const [loading, setLoading] = useState(true);

    const fetchUserListings = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); 
      if (!token) {
        router.replace("/(tabs)/SignInScreen"); 
        return;
      }

      setLoading(true);
      const storedUser = await AsyncStorage.getItem("userInfo");
      setUser(storedUser ? JSON.parse(storedUser) : null);

      const res = await fetch(`${baseURL}/api/listings/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setInfo(data);
    } catch (error) {
      console.error(error);
      router.replace("/(tabs)/SignInScreen");
    } finally {
      setLoading(false);
    }
  };


  const changeStatus = async (houseId, currentStatus) => {

    try {
      const token = await AsyncStorage.getItem("userToken");

      const res = await fetch(`${baseURL}/api/rentalstatus/${houseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: !currentStatus }),
      });

      const data = await res.json();
      console.log("Updated status:", data);

      fetchUserListings();

    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

    const changeBedspaces = async (BHId, beds) => {

    try {
      const token = await AsyncStorage.getItem("userToken");

      const res = await fetch(`${baseURL}/api/bedspaces/${BHId}/beds`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ beds }),
      });

      const data = await res.json();
      console.log("Updated beds:", data);

      fetchUserListings();

    } catch (err) {
      console.error("Error updating bedspaces:", err);
    }
  };


  const [bedInput, setBedInput] = useState({});

  // delete property
  const confirmDelete = (id, type) => {
    router.push({
      pathname:"/screens/confirmdeletescreen",
      params: { propertyId: id, propertyType: type }
    });
  };

  const handleEdit = (id, type) => {
    const path = type === "house" ? "edithouse" : "editboardinghouse";
    router.push({ pathname:`/screens/${path}`, params:{ propertyId:id, propertyType:type }});
  };

    useFocusEffect(
      useCallback(() => {
        fetchUserListings();
      }, [])
    );

  // Render functions
  const renderHouses = ({ item }) => {
    const fallbackImage = "https://placehold.co/600x400?text=No+House+Image";
    const imagesToShow = item.images && item.images.length > 0 ? item.images : [fallbackImage];
    const rentStatus = item.status ? "Rented" : "Available";

    return (
      <View style={styles.listItem}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {imagesToShow.map((img, idx) => <Image key={idx} source={{ uri: img }} style={styles.houseImage} />)}
        </ScrollView>

        <View style={styles.infoContainer}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text style={styles.listPrice}>{item.location}</Text>
          <Text style={styles.listPrice}>K{item.price}</Text>

          <Text style={{ color: rentStatus === "Available" ? "green" : "red", fontWeight: "bold", marginTop:5 }}>
            Rental status: {rentStatus}
          </Text>

        <TouchableOpacity onPress={() => changeStatus(item.id, item.status)} style={{marginTop:5}}>
          <Text style={{ color:"blue" }}>
            {item.status ? "Mark as Available" : "Mark as Rented"}
          </Text>
        </TouchableOpacity>

        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id, "house")}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id, "house")}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBoardingHouses = ({ item }) => {
    const fallbackImage = "https://placehold.co/600x400?text=No+BoardingHouse+Image";
    const imagesToShow = item.images && item.images.length > 0 ? item.images : [fallbackImage];
    const availableBeds = item.bedspaces_available; 

    return (
      <View style={styles.listItem}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {imagesToShow.map((img, idx) => <Image key={idx} source={{ uri: img }} style={styles.houseImage} />)}
        </ScrollView>

        <View style={styles.infoContainer}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text style={styles.listPrice}>K{item.price}</Text>
          <Text style={styles.listPrice}>{item.location}</Text>

          <Text style={{ color: availableBeds > 0 ? "green" : "red", fontWeight: "bold", marginTop:5 }}>
            {availableBeds} Bedspaces available
          </Text>

          {/* Input to change bed spaces */}
          <View style={{ flexDirection:"row", marginTop:5, alignItems:"center" }}>
            <TextInput
              style={{ borderWidth:1, borderColor:"gray", padding:5, width:60, marginRight:10 }}
              keyboardType="number-pad"
              placeholder={`${availableBeds}`}
              value={bedInput[item.id]?.toString() || ""}
              onChangeText={val => setBedInput({...bedInput, [item.id]: val})}
            />
            <TouchableOpacity onPress= {()=> changeBedspaces(item.id, bedInput[item.id])}>
              <Text style={{color:"blue"}}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id, "boardinghouse")}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id, "boardinghouse")}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}> Loading... </Text>
      </SafeAreaView>
    );
  }

  const EmptyState = ({ type }) => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name={type === "house" ? "home-off" : "home-city-outline"}
        size={60} color="gray"
      />
      <Text style={styles.emptyText}>
        {type === "house" ? "No houses listed yet" : "No boarding houses listed yet"}
      </Text>
      <TouchableOpacity
        style={styles.addListingButton}
        onPress={() => router.push("/screens/addlisting")}
      >
        <Text style={styles.addListingButtonText}>
          {type === "house" ? "Add your first house" : "Add your first boarding house"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <CustomDrawer>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.header}> Welcome {user?.name} </Text>
        <Text style={styles.subHeader}> Manage your properties here </Text>

        <Text style={styles.sectionTitle}> Houses 🏠</Text>
        {info.houses.length === 0 ? (
          <EmptyState type="house" />
        ) : (
          <FlatList data={info.houses} renderItem={renderHouses} keyExtractor={item => item.id.toString()} />
        )}

        <Text style={styles.sectionTitle}> Boarding Houses 🏢 </Text>
        {info.boarding_houses.length === 0 ? (
          <EmptyState type="boardinghouse" />
        ) : (
          <FlatList data={info.boarding_houses} renderItem={renderBoardingHouses} keyExtractor={item => item.id.toString()} />
        )}
      </View>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "green",
    fontSize: 30,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
    alignSelf: "center",
  },
  subHeader: {
    fontSize: 17,
    marginBottom: 15,
    marginTop: 9,
    alignSelf:"center"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  emptyText: {
    color: "gray",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  addListingButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  addListingButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  listItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  listPrice: {
    fontSize: 16,
    color: "black",
    marginTop: 5,
  },
  houseImage: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  buttonRow: {
  flexDirection: "row",
  justifyContent: "flex-start",
  marginTop: 10,
  gap: 10, 
},
editButton: {
  backgroundColor: "#4CAF50", 
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 5,
},
deleteButton: {
  backgroundColor: "#F44336", 
  paddingVertical: 8,
  paddingHorizontal: 15,
  borderRadius: 5,
},
buttonText: {
  color: "white",
  fontWeight: "600",
},
});
