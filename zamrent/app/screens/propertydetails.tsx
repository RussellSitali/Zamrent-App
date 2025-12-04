import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Swiper from "react-native-swiper";

export default function PropertyDetailsScreen() {
  const { property } = useLocalSearchParams();
  const propertyData = JSON.parse(property);
  const router = useRouter();

  const handleCall = () => {
    if (propertyData.phone_number) {
      Linking.openURL(`tel:${propertyData.phone_number}`);
    }
  };

  const handleWhatsApp = () => {
    if (propertyData.ownerPhone) {
      Linking.openURL(`https://wa.me/${propertyData.phone_number.replace(/\D/g, "")}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 10, paddingBottom: 50, marginTop:35 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        <View style={styles.card}>
          <Swiper
            style={{ height: 250 }}
            dotColor="#ccc"
            activeDotColor="#2f95dc"
            autoplay={false}
            loop={true}
          >
            {propertyData.images && propertyData.images.length > 0 ? (
              propertyData.images.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.image}
                />
              ))
            ) : (
              <View style={styles.noImage}>
                <Text>No Images</Text>
              </View>
            )}
          </Swiper>
        </View>

        {/* Property Info */}
        <View style={styles.card}>
          <Text style={styles.price}>{propertyData.title}</Text>

          <Text style={styles.price}>
            {propertyData.description || "No description available."}
          </Text>

          <Text style={styles.price}>
            location: {propertyData.location || "No location provided."}
          </Text>

           <Text style={styles.price}>K{propertyData.price}</Text>

            {propertyData.bathrooms? 
                 <Text style={styles.price}>Bathrooms {propertyData.bathrooms}</Text> : 
               ""
             }

              {propertyData.bedrooms? (
                <Text>{propertyData.bedrooms} bedrooms</Text>
              ):(
                <Text> </Text>
              )}

          {propertyData.type === "house" ? (
                                  propertyData.status ? (
                                    <Text style={{ color: "red", fontSize: 20 }}>Rented</Text>
                                  ) : (
                                    <Text style={{ color: "green", fontSize: 20 }}>Available</Text>
                                  )
                                ) : propertyData.type === "boardinghouse" ? (
                                  <Text style={{ fontSize: 20 }}>
                                    Bedspaces available: {propertyData.bedspaces_available}
                                  </Text>
                    ) : null}


            {propertyData.distance ? (
                <Text style={{ fontSize: 19, color: "black" }}>
                  Approximately {propertyData.distance.toFixed(2)} km away from where you are
                </Text>
              ) : null}

        </View>

        {/* Contact Buttons */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Contact Owner</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <Text style={styles.contactText}>📞 Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: "#25D366" }]} onPress={handleWhatsApp}>
              <Text style={styles.contactText}>💬 WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backText: { fontSize: 18, color: "#2f95dc" },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  image: {
    width: Dimensions.get("window").width - 40,
    height: 250,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 10,
  },
  noImage: {
    width: Dimensions.get("window").width - 40,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },

  title: { fontSize: 17, fontWeight: "bold", marginBottom: 5 },
  price: { fontSize: 21, color: "black", marginBottom: 0 },
  sectionHeader: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  description: { fontSize: 20, marginTop: 5 , fontWeight:"500"},

  contactButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#2f95dc",
    alignItems: "center",
  },
  contactText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});



