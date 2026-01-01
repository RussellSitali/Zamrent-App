import React, { useState,  useCallback  } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native"; 

export default function EditBoardingHouse() {
  const router = useRouter();
  const { propertyId } = useLocalSearchParams();

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
    bedspaces: "",
    bathrooms: "",
    latitude: null,
    longitude: null,
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing data
  useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
              router.replace("/(tabs)/SignInScreen");
              return;
            }

            const res = await axios.get(
              `http://localhost:5000/api/changeboardinghouse/${propertyId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = res.data.boardinghouse;

            setForm({
              title: data.title,
              location: data.location,
              description: data.description,
              price: data.price.toString(),
              bedspaces: data.bed_spaces.toString(),
              bathrooms: data.bathrooms.toString(),
              latitude: data.latitude,
              longitude: data.longitude,
            });
            setOldImages(res.data.images || []);
          } catch (err) {
            console.error("Failed to fetch listing", err);
            setError("Failed to load data");
          }
        };

        fetchData();
      }, [propertyId])
    );

  // Update form fields
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Capture current location
  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setForm((prev) => ({
        ...prev,
        latitude: loc.coords.latitude.toString(),
        longitude: loc.coords.longitude.toString(),
      }));
      alert("Location captured!");
    } catch (err) {
      alert("Unable to get location: " + err.message);
      console.error(err);
    }
  };

  // Pick new images (must be 3)
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const picked = result.assets;
      if (picked.length !== 3) {
        alert("Please select exactly 3 images.");
        return;
      }
      setNewImages(picked);
    }
  };

  // Submit updated data
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const storedUser = await AsyncStorage.getItem("userInfo");
      const token = await AsyncStorage.getItem("userToken");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || !token) {
        setError("You must be logged in");
        setLoading(false);
        return;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        bed_spaces: Number(form.bedspaces),
        bathrooms: Number(form.bathrooms),
      };

      // If new images were selected, upload them first
if (newImages.length === 3) {
  const uploadedImages = [];

  for (const img of newImages) {
    if (!img.uri) {
      console.warn("Skipping image, no uri:", img);
      continue;
    }

      // Fetch image as blob (web + mobile compatible)
      const response = await fetch(img.uri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "zamrent");

      const cloudResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dcq19o3if/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudResponse.json();

      if (!cloudResponse.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      uploadedImages.push({
        image_url: data.secure_url,   
        public_id: data.public_id,
      });
    }

    // attach to payload sent to backend
    payload.images = uploadedImages;
    console.log(payload.images, "These are the payload images");
  }


      // Update listing in backend
      const res = await axios.patch(
        `http://localhost:5000/api/property/updateboardinghouse/${propertyId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Boarding house updated successfully.");
      router.push("/(tabs)/Profile");
    } catch (err) {
      console.error("Update failed", err);
      setError("Something went wrong while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Edit Boarding House</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={form.title}
          onChangeText={(text) => handleChange("title", text)}
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
          placeholder="Location"
          value={form.location}
          onChangeText={(text) => handleChange("location", text)}
        />

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleGetLocation}>
          <Text style={styles.buttonText}> Use My Current Location </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Bed Spaces"
          keyboardType="numeric"
          value={form.bedspaces}
          onChangeText={(text) => handleChange("bedspaces", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Bathrooms"
          keyboardType="numeric"
          value={form.bathrooms}
          onChangeText={(text) => handleChange("bathrooms", text)}
        />

        <Text style={{ marginTop: 15, fontWeight: "bold" }}> Current Images:</Text>
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
          <Text style={styles.buttonText}> Upload less than 6 New Images (optional)</Text>
        </TouchableOpacity>

        {newImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {newImages.map((img, index) => (
              <Image key={index} source={{ uri: img.uri }} style={styles.imagePreview} />
            ))}
          </View>
        )}

        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}> Update Listing </Text>
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
