import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";


export default function SearchResultsScreen() {
  const { results } = useLocalSearchParams();
  const finalData = JSON.parse(results);
  const router = useRouter();

  console.log("Here is the bingo cart ",finalData)

  const renderItem = ({ item }) => {
    const coverImage = item.images?.[0] || null;
    console.log("Reached!")

    return (
      <TouchableOpacity
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
            backgroundColor: "#fff",
          }}
        >
          {/* COVER IMAGE */}
          {coverImage ? (
            <Image
              source={coverImage}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 10,
              }}
              contentFit="cover"
              transition={300}
              cachePolicy="disk"
              placeholder={require("../../assets/images/placeholder.png")}

            />
          ) : (
            <View
              style={{
                height: 200,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#eee",
                borderRadius: 10,
              }}
            >
              <Text>No Image</Text>
            </View>
          )}

          {/* DETAILS */}
          <Text
            style={{
              fontSize: 20,
              color: "black",
              fontWeight: "900",
              marginTop: 10,
            }}
          >
            {item.title}
          </Text>

          <Text style={{ fontSize: 18, color: "grey", fontWeight: "600" }}>
            {item.location}
          </Text>

          {item.bedrooms && (
            <Text style={{ color: "grey", fontSize: 18, fontWeight: "600" }}>
              {item.bedrooms} Rooms
            </Text>
          )}

          <Text
            style={{
              fontSize: 18,
              color: "grey",
              marginTop: 8,
              fontWeight: "600",
            }}
          >
            K{item.price} / month
          </Text>

          {item.distance !== undefined && (
            <Text
              style={{
                fontSize: 16,
                color: "black",
                marginTop: 6,
              }}
            >
              {item.distance < 0.5
                ? `Approximately ${(item.distance * 1000).toFixed(
                    0
                  )} meters away`
                : `Approximately ${item.distance.toFixed(2)} km away`}
            </Text>
          )}

          {/* STATUS */}
          {item.type === "house" ? (
            item.status ? (
              <Text
                style={{
                  color: "red",
                  fontSize: 18,
                  fontWeight: "600",
                  marginTop: 8,
                }}
              >
                Rented ❌
              </Text>
            ) : (
              <Text
                style={{
                  color: "green",
                  fontSize: 18,
                  fontWeight: "600",
                  marginTop: 8,
                }}
              >
                Available ✅
              </Text>
            )
          ) : item.type === "boardinghouse" ? (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginTop: 8,
              }}
            >
              Bedspaces available: {item.bedspaces_available}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
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

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 20,
          }}
        >
          Search Results
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={finalData}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={{ padding: 10 }}
        renderItem={renderItem}
        ListEmptyComponent={
          <View
            style={{
              marginTop: 100,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#555",
              }}
            >
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
        }
      />
    </SafeAreaView>
  );
}
