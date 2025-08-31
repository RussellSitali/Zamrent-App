import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function EditHouse() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
    bedrooms: "",
    latitude: null,
    longitude: null,
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  // Fetch existing house data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "No token found. Please log in again.");
          router.replace("/(tabs)/SignInScreen");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/changehouse/${propertyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.house;
        setForm({
          title: data.title,
          location: data.location,
          description: data.description,
          price: data.price.toString(),
          bedrooms: data.bedrooms.toString(),
          latitude: data.latitude,
          longitude: data.longitude,
        });
        setOldImages(res.data.images || []);
      } catch (err) {
        console.error("Failed to fetch house", err);
        Alert.alert("Error", "Failed to load house data.");
      }
    };

    fetchData();
  }, [propertyId]);

  // Update form fields
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Capture current location
  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access was denied.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setForm((prev) => ({
        ...prev,
        latitude: loc.coords.latitude.toString(),
        longitude: loc.coords.longitude.toString(),
      }));
      setLocationCaptured(true);
      Alert.alert("Success", "Location captured!");
    } catch (err) {
      Alert.alert("Error", "Unable to get location.");
      console.error(err);
    }
  };

  // Pick new images (must be exactly 3)
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets;
      if (picked.length !== 3) {
        Alert.alert("Invalid", "Please select exactly 3 images.");
        return;
      }
      setNewImages(picked);
    }
  };

  // Upload to Cloudinary
  const uploadToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    formData.append("upload_preset", "zamrent");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dcq19o3if/image/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return { url: res.data.secure_url, public_id: res.data.public_id };
  };

  // Extract Cloudinary public_id from URL
  const extractPublicId = (url) => {
    const parts = url.split("/upload/")[1];
    const withoutVersion = parts.split("/").slice(1).join("/");
    return withoutVersion.split(".")[0];
  };

  // Submit updated house
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        setLoading(false);
        return;
      }

      let imageUrls = [];

      if (newImages.length === 3) {
        imageUrls = await Promise.all(newImages.map(uploadToCloudinary));
      }

      const payload = {
        ...form,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
        ...(imageUrls.length === 3 && { images: imageUrls }),
      };

      const res = await axios.patch(
        `http://localhost:5000/api/updatehouse/${propertyId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Delete old Cloudinary images if backend sends back deleted URLs
      const deletedUrls = res.data.deletedCloudinaryUrls;
      if (Array.isArray(deletedUrls)) {
        for (const url of deletedUrls) {
          const publicId = extractPublicId(url);
          await axios.post(
            "http://localhost:5000/api/delete-from-cloudinary",
            { public_id: publicId }
          );
        }
      }

      Alert.alert("Success", "House updated successfully.");
      router.push("/(tabs)/Profile");
    } catch (err) {
      console.error("Update failed", err);
      Alert.alert("Error", "Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Edit House</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={form.title}
          onChangeText={(text) => handleChange("title", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={form.location}
          onChangeText={(text) => handleChange("location", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={form.price}
          onChangeText={(text) => handleChange("price", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Bedrooms"
          keyboardType="numeric"
          value={form.bedrooms}
          onChangeText={(text) => handleChange("bedrooms", text)}
        />

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleGetLocation}>
          <Text style={styles.buttonText}>Use My Current Location</Text>
        </TouchableOpacity>

        {locationCaptured && (
          <Text style={{ color: "green", fontWeight: "bold" }}>
            Location has been set using your current position.
          </Text>
        )}

        <Text style={{ marginTop: 15, fontWeight: "bold" }}>Current Images:</Text>
        <View style={styles.imagePreviewContainer}>
          {oldImages.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.image_url }}
              style={styles.imagePreview}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.buttonSecondary} onPress={pickImages}>
          <Text style={styles.buttonText}>Upload 3 New Images (optional)</Text>
        </TouchableOpacity>

        {newImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {newImages.map((img, index) => (
              <Image key={index} source={{ uri: img.uri }} style={styles.imagePreview} />
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Update Listing</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
    alignSelf: "center",
  },
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
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
});
