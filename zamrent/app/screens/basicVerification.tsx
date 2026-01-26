import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BasicVerificationScreen() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { property_id, owner_id, property_type } = useLocalSearchParams();

  const [nrcFront, setNrcFront] = useState(null);
  const [selfieWithNrc, setSelfieWithNrc] = useState(null);
  const [outsidePhoto, setOutsidePhoto] = useState(null);
  const [insidePhotos, setInsidePhotos] = useState([]);


  const pickSingleImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setter(result.assets[0]);
    }
  };

  const pickInsidePhotos = async () => {
    if (insidePhotos.length >= 2) {
      Alert.alert("Limit reached", "You can upload only 2 inside photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const remainingSlots = 2 - insidePhotos.length;
      setInsidePhotos((prev) => [
        ...prev,
        ...result.assets.slice(0, remainingSlots),
      ]);
    }
  };

  const uploadImagesToCloudinary = async (images) => {
    const uploadedImages = [];

    for (const img of images) {
      if (!img?.uri) continue;

      const formData = new FormData();

      if (Platform.OS === "web") {
        const response = await fetch(img.uri);
        const blob = await response.blob();
        formData.append("file", blob);
      } else {
        formData.append("file", {
          uri: img.uri,
          name: img.fileName || `photo_${Date.now()}.jpg`,
          type: img.mimeType || "image/jpeg",
        });
      }

      formData.append("upload_preset", "zamrent");

      const cloudResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dcq19o3if/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudResponse.json();

      if (!cloudResponse.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      uploadedImages.push({
        image_url: data.secure_url,
        public_id: data.public_id,
      });
    }

    return uploadedImages;
  };

    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem("userToken"); 

        if (!nrcFront || !selfieWithNrc || !outsidePhoto || insidePhotos.length !== 2) {
          Alert.alert(
            "Incomplete submission",
            "Please upload all required photos before submitting."
          );
          return;
        }

        try {
          // 1️⃣ Prepare images with categories
          const allImages = [
            { image: nrcFront, category: "nrc_front" },
            { image: selfieWithNrc, category: "selfie_with_nrc" },
            { image: outsidePhoto, category: "outside_property" },
            ...insidePhotos.map((img) => ({
              image: img,
              category: "inside_property",
            })),
          ];

          // 2️⃣ Upload to Cloudinary
          const uploaded = [];

          for (const item of allImages) {
            const [uploadedImage] = await uploadImagesToCloudinary([item.image]);

            uploaded.push({
              image_url: uploadedImage.image_url,
              public_id: uploadedImage.public_id,
              category: item.category,
            });
          }

          // 3️⃣ SEND TO BACKEND (THIS IS WHAT WAS MISSING)
          const response = await fetch(
            `${baseURL}/api/basicverifications`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                property_id,
                owner_id,
                property_type,
                verification_type: "basic",
                images: uploaded,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Verification submission failed");
          }

          // 4️⃣ Success
          Alert.alert(
            "Submitted",
            "Your basic verification has been submitted and is pending review."
          );

          router.replace("/(tabs)/Profile");

        } catch (error) {
          console.error("Verification error:", error);
          Alert.alert("Upload failed", error.message);
        }
      };


  const renderImage = (img) =>
    img && <Image source={{ uri: img.uri }} style={styles.preview} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Basic Verification" }} />

      <Text style={styles.title}>Basic Verification</Text>
      <Text style={styles.note}>
        Upload clear photos to verify ownership. Payment will be requested after
        approval.
      </Text>

      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickSingleImage(setNrcFront)}>
        <Text>Upload NRC (Front)</Text>
      </TouchableOpacity>
      {renderImage(nrcFront)}

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => pickSingleImage(setSelfieWithNrc)}
      >
        <Text>Selfie Holding NRC</Text>
      </TouchableOpacity>
      {renderImage(selfieWithNrc)}

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => pickSingleImage(setOutsidePhoto)}
      >
        <Text>Photo Outside Property</Text>
      </TouchableOpacity>
      {renderImage(outsidePhoto)}

      <TouchableOpacity style={styles.uploadBtn} onPress={pickInsidePhotos}>
        <Text>Upload Inside Property Photos (2)</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        {insidePhotos.map((img, i) => (
          <Image key={i} source={{ uri: img.uri }} style={styles.previewSmall} />
        ))}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Verification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f7f7f7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  note: { fontSize: 13, color: "#555", marginBottom: 16 },
  uploadBtn: {
    backgroundColor: "#e0e0e0",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  preview: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  previewSmall: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 8,
  },
  row: { flexDirection: "row", marginBottom: 16 },
  submitBtn: {
    backgroundColor: "#2a2a72",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
