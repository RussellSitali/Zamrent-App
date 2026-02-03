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
import { ActivityIndicator } from "react-native";

export default function BasicVerificationScreen() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { property_id, owner_id, property_type } = useLocalSearchParams();

  const [nrcFront, setNrcFront] = useState(null);
  const [selfieWithNrc, setSelfieWithNrc] = useState(null);
  const [outsidePhoto, setOutsidePhoto] = useState(null);
  const [insidePhotos, setInsidePhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ NEW
  const [serverMessage, setServerMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const pickSingleImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      exif: false,
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

    setServerMessage(""); // ✅ reset message
    setIsLoading(true);

    if (!nrcFront || !selfieWithNrc || !outsidePhoto || insidePhotos.length !== 2) {
      Alert.alert(
        "Incomplete submission",
        "Please upload all required photos before submitting."
      );
      setIsLoading(false);
      return;
    }

    try {
      const allImages = [
        { image: nrcFront, category: "nrc_front" },
        { image: selfieWithNrc, category: "selfie_with_nrc" },
        { image: outsidePhoto, category: "outside_property" },
        ...insidePhotos.map((img) => ({
          image: img,
          category: "inside_property",
        })),
      ];

      const uploaded = [];

      for (const item of allImages) {
        const [uploadedImage] = await uploadImagesToCloudinary([item.image]);

        uploaded.push({
          image_url: uploadedImage.image_url,
          public_id: uploadedImage.public_id,
          category: item.category,
        });
      }

      const response = await fetch(`${baseURL}/api/basicverifications`, {
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification submission failed");
      }

      // ✅ SUCCESS MESSAGE
      setMessageType("success");
      setServerMessage(
        "Your verification has been submitted and is pending review."
      );

      setTimeout(() => {
        router.replace("/(tabs)/Profile");
      }, 1500);

    } catch (error) {
      console.error("Verification error:", error);

      // ✅ ERROR MESSAGE
      setMessageType("error");
      setServerMessage(error.message || "Something went wrong. Please try again.");
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

      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickSingleImage(setSelfieWithNrc)}>
        <Text>Selfie Holding NRC</Text>
      </TouchableOpacity>
      {renderImage(selfieWithNrc)}

      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickSingleImage(setOutsidePhoto)}>
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

      <TouchableOpacity 
        style={[styles.submitBtn, isLoading && styles.disabledBtn]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.submitText}>Submitting...</Text>
      </View>
    ) : (
      <Text style={styles.submitText}>Submit Verification</Text>
    )}
      </TouchableOpacity>

      {/* ✅ RESPONSE MESSAGE */}
      {serverMessage ? (
        <Text
          style={[
            styles.responseText,
            messageType === "success" ? styles.successText : styles.errorText,
          ]}
        >
          {serverMessage}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  note: {
    color: "#555",
    marginBottom: 20,
  },
  uploadBtn: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  previewSmall: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  submitBtn: {
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  // ✅ NEW STYLES
  responseText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  successText: {
    color: "#16a34a",
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  disabledBtn: {
  backgroundColor: "#ccc", 
  padding: 15,
  borderRadius: 10,
  marginTop: 20,
  opacity: 0.7,
},
});
