import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Swiper from "react-native-swiper";

export default function Results() {
  const { results } = useLocalSearchParams();
  const finalData = JSON.parse(results);
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header with Back Button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
        }}
      >
        <TouchableOpacity onPress={() => router.push("/(tabs)/HomeScreen")}>
          <Text style={{ fontSize: 18, color: "#2f95dc" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>
          Search Results
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {finalData.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#555" }}>
              No properties found
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#888",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Try adjusting your search criteria or check back later.
            </Text>
          </View>
        ) : (
          finalData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                router.push({
                  pathname: "/screens/propertydetails",
                  params: { property: JSON.stringify(item) },
                })
              }
            >
              <View
                style={{
                  marginBottom: 20,
                  padding: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#ddd",
                }}
              >
                {/* Image Slider */}
                <Swiper
                  style={{ height: 200 }}
                  dotColor="#ccc"
                  activeDotColor="#2f95dc"
                  autoplay={false}
                  loop={true}
                >
                  {item.images && item.images.length > 0 ? (
                    item.images.map((img, i) => (
                      <Image
                        key={i}
                        source={{ uri: img }}
                        style={{
                          width: Dimensions.get("window").width - 40,
                          height: 200,
                          borderRadius: 10,
                          resizeMode: "cover",
                        }}
                      />
                    ))
                  ) : (
                    <View
                      style={{
                        width: Dimensions.get("window").width - 40,
                        height: 200,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#eee",
                        borderRadius: 10,
                      }}
                    >
                      <Text>No Images</Text>
                    </View>
                  )}
                </Swiper>

                {/* Property Details */}
                <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
                  {item.title}
                </Text>
                 <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
                  location: {item.location}
                </Text>
                <Text style={{ fontSize: 16, color: "black" }}>K{item.price}</Text>
               {item.type === "house" ? (
                          item.status ? (
                            <Text style={{ color: "red", fontSize: 19 }}>Rented</Text>
                          ) : (
                            <Text style={{ color: "green", fontSize: 20 }}>Available</Text>
                          )
                        ) : item.type === "boardinghouse" ? (
                          <Text style={{ fontSize: 15 }}>
                            Bedspaces available: {item.bed_spaces}
                          </Text>
                   ) : null}

              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
