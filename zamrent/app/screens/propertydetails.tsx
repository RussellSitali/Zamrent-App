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

  console.log("Trying to see the phone number", propertyData.phone_number);

 

  const handleWhatsApp = () => {
    if (propertyData.ownerPhone) {
      Linking.openURL(`https://wa.me/${propertyData.phone_number.replace(/\D/g, "")}`);
    }
  };
  
return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5", paddingTop: 20, }}>
    {/* Sticky Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Property Details</Text>
    </View>

    <ScrollView
      contentContainerStyle={{ padding: 12, paddingBottom: 60, marginTop: 45 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Image Slider */}
      <View style={styles.card}>
        <View style={{ position: "relative" }}>
          <Swiper
            style={{ height: 280 }}
            dotColor="#d1d5db"
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

          {/* Price Badge */}
          <View
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              backgroundColor: "rgba(0,0,0,0.75)",
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              ZMW {propertyData.price} / month
            </Text>
          </View>
        </View>
      </View>

      {/* Property Info */}
      <View style={styles.card}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#111827",
            marginBottom: 6,
          }}
        >
          {propertyData.title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#6b7280",
            marginBottom: 12,
          }}
        >
          {propertyData.location}
        </Text>

        <Text
          style={{
            fontSize: 17,
            lineHeight: 24,
            color: "#374151",
            marginBottom: 14,
          }}
        >
          {propertyData.description || "No description available."}
        </Text>

        {/* Info Chips */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {propertyData.bedrooms ? (
            <View
              style={{
                backgroundColor: "#f1f5f9",
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600" }}>
                🛏 {propertyData.bedrooms} Rooms
              </Text>
            </View>
          ) : null}

          {propertyData.bathrooms ? (
            <View
              style={{
                backgroundColor: "#f1f5f9",
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600" }}>
                🚿 {propertyData.bathrooms} Bathrooms
              </Text>
            </View>
          ) : null}

          {propertyData.distance !== undefined && (
            <View
              style={{
                backgroundColor: "#f1f5f9",
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600" }}>
                📍 {propertyData.distance < 0.5
                  ? `${(propertyData.distance * 1000).toFixed(0)} m away`
                  : `${propertyData.distance.toFixed(2)} km away`}
              </Text>
            </View>
          )}
        </View>

        {/* Status */}
        {propertyData.type === "house" ? (
          propertyData.status ? (
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#fee2e2",
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 20,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#b91c1c", fontWeight: "700" }}>
                Rented ❌
              </Text>
            </View>
          ) : (
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#dcfce7",
                paddingVertical: 6,
                paddingHorizontal: 14,
                borderRadius: 20,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#166534", fontWeight: "700" }}>
                Available ✅
              </Text>
            </View>
          )
        ) : propertyData.type === "boardinghouse" ? (
          <View
            style={{
              marginTop: 14,
              backgroundColor: "#e0f2fe",
              paddingVertical: 6,
              paddingHorizontal: 14,
              borderRadius: 20,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ fontWeight: "700" }}>
              Bedspaces available: {propertyData.bedspaces_available}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Contact Section */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Contact Owner</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          <TouchableOpacity
            style={[styles.contactButton, { borderRadius: 30 }]}
            onPress={handleCall}
          >
            <Text style={styles.contactText}>📞 Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.contactButton,
              { backgroundColor: "#25D366", borderRadius: 30 },
            ]}
            onPress={handleWhatsApp}
          >
            <Text style={styles.contactText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.reportButton, { marginTop: 20 }]}
          onPress={() =>
            router.push({
              pathname: "/screens/reportpage",
              params: {
                listing_id: propertyData.id,
                owner_phone: propertyData.phone_number,
                title: propertyData.title,
              },
            })
          }
        >
          <Text style={styles.reportIcon}>⚠️</Text>
          <Text style={styles.reportText}>Report this listing</Text>
        </TouchableOpacity>

        <Text style={styles.reportSubText}>
          Something wrong or suspicious about this property?
        </Text>
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

  reportCard: {
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 12,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "#f5c6cb",
},
priceBadge: {
  position: "absolute",
  bottom: 12,
  right: 12,
  backgroundColor: "rgba(0,0,0,0.75)",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
},

priceBadgeText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

reportButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#dc3545",
  backgroundColor: "#fff5f5", // soft red background
},

reportIcon: {
  fontSize: 18,
  marginRight: 8,
},

reportText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#dc3545",
  letterSpacing: 0.3,
},

reportSubText: {
  marginTop: 8,
  fontSize: 14,
  color: "#6c757d",
  textAlign: "center",
}, 
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
    // width: Dimensions.get("window").width - 40,
    width:"100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
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

  title: { fontSize: 24,fontWeight: "800",marginBottom: 6,},
  price: { fontSize: 21, color: "black", marginBottom: 0, },
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




