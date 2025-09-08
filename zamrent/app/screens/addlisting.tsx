import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CustomDrawer from "../../components/drawer";

export default function AddListing() {
  const router = useRouter();

  const [listingType, setListingType] = useState("house");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [bedSpaces, setBedSpaces] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        try {
          const storedUser = await AsyncStorage.getItem("userInfo");
          const token = await AsyncStorage.getItem("userToken");
          if (!storedUser || !token) {
            router.replace("/(tabs)/SignInScreen");
            return;
          }
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Error checking auth", err);
          router.replace("/(tabs)/SignInScreen");
        }
      };
      checkAuth();
    }, [])
  );

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLatitude(loc.coords.latitude.toString());
      setLongitude(loc.coords.longitude.toString());
      alert("Location captured!");
    } catch (err) {
      alert("Unable to get location: " + err.message);
      console.error(err);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!user) {
        setError("You must be logged in");
        setLoading(false);
        return;
      }

      if (!title || !description || !price || !location) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (images.length !== 3) {
        setError("Please upload exactly 3 images");
        setLoading(false);
        return;
      }

      // Upload images to Cloudinary
      const uploadedImages = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append("file", {
          uri: img.uri,
          type: "image/jpeg",
          name: `listing_${Date.now()}.jpg`,
        });
        formData.append("upload_preset", "zamrent");
        formData.append("folder", "zamrent_listings");

        const cloudResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dcq19o3if/image/upload",
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const cloudData = await cloudResponse.json();
        console.log("Cloudinary response:", cloudData);

        if (!cloudResponse.ok) {
          throw new Error(cloudData.error?.message || "Cloudinary upload failed");
        }

        uploadedImages.push({
          url: cloudData.secure_url,
          public_id: cloudData.public_id,
        });
      }

      // Create listing payload
      let endpoint = "";
      let payload = {};

      if (listingType === "house") {
        if (!numberOfRooms) {
          setError("Please specify number of rooms");
          setLoading(false);
          return;
        }
        endpoint = `http://localhost:5000/api/property/house`;
        payload = {
          title,
          owner_id: user.id,
          location,
          latitude,
          longitude,
          description,
          type: listingType,
          bedrooms: Number(numberOfRooms),
          price: Number(price),
          images: uploadedImages,
        };
      } else {
        if (!bedSpaces || !bathrooms) {
          setError("Please specify bed spaces and bathrooms");
          setLoading(false);
          return;
        }
        endpoint = `http://localhost:5000/api/property/boardinghouse`;
        payload = {
          title,
          owner_id: user.id,
          description,
          price: Number(price),
          location,
          type: listingType,
          latitude,
          longitude,
          bed_spaces: Number(bedSpaces),
          bathrooms: Number(bathrooms),
          images: uploadedImages,
        };
      }

      // Send listing to backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add listing");

      router.push("/(tabs)/Profile");
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error while adding listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDrawer>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Add New Listing</Text>

          {/* Listing type toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={() => setListingType("house")}>
              <Text
                style={[
                  styles.toggleButton,
                  listingType === "house" && styles.activeToggle,
                ]}
              >
                House
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setListingType("boardinghouse")}>
              <Text
                style={[
                  styles.toggleButton,
                  listingType === "boardinghouse" && styles.activeToggle,
                ]}
              >
                Boarding House
              </Text>
            </TouchableOpacity>
          </View>

          {/* Common inputs */}
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity style={styles.buttonSecondary} onPress={handleGetLocation}>
            <Text style={styles.buttonText}>Use My Current Location</Text>
          </TouchableOpacity>

          {/* Specific inputs */}
          {listingType === "house" ? (
            <TextInput
              style={styles.input}
              placeholder="Number of bedrooms"
              keyboardType="numeric"
              value={numberOfRooms}
              onChangeText={setNumberOfRooms}
            />
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Bed Spaces"
                keyboardType="numeric"
                value={bedSpaces}
                onChangeText={setBedSpaces}
              />
              <TextInput
                style={styles.input}
                placeholder="Bathrooms"
                keyboardType="numeric"
                value={bathrooms}
                onChangeText={setBathrooms}
              />
            </View>
          )}

          {/* Images */}
          <TouchableOpacity style={styles.buttonSecondary} onPress={pickImages}>
            <Text style={styles.buttonText}>Upload Images</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              {images.map((img, index) => (
                <View key={index} style={{ position: "relative", marginRight: 10 }}>
                  <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {error && <Text style={{ color: "red" }}>{error}</Text>}

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {loading ? "Adding..." : "Add Listing"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
    alignSelf: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "center",
  },
  toggleButton: {
    fontSize: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    marginHorizontal: 5,
    borderRadius: 5,
    color: "gray",
  },
  activeToggle: { backgroundColor: "blue", color: "white", borderColor: "blue" },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: "blue",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "gray",
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  imagePreviewContainer: {
    flexDirection: "row",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  imagePreview: { width: 100, height: 100, borderRadius: 5 },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
