import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function BasicVerificationScreen() {
  const router = useRouter();

  const [airtelNumber, setAirtelNumber] = useState("");
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [selfieFront, setSelfieFront] = useState(null);
  const [selfieBack, setSelfieBack] = useState(null);
  const [propertyPics, setPropertyPics] = useState([null, null, null]);

  const pickImage = async (setter) => {
   const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images, 
        allowsMultipleSelection: true,
        quality: 1,
    });


    if (!result.canceled) {
      setter(result.assets[0]);
    }
  };

  const pickPropertyImage = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const updated = [...propertyPics];
      updated[index] = result.assets[0];
      setPropertyPics(updated);
    }
  };

    const handleSubmit = async () => {
        if (!airtelNumber) {
            Alert.alert("Error", "Please enter your Airtel Money number");
            return;
        }

        console.log("Airtel Money Number submitted:", airtelNumber);

        try {
            const uploadedImages = [];

            // Collect all images
            const allImages = [
            { label: "ID Front", image: idFront },
            { label: "ID Back", image: idBack },
            { label: "Selfie Front", image: selfieFront },
            { label: "Selfie Back", image: selfieBack },
            ...propertyPics.map((img, idx) => ({ label: `Property ${idx + 1}`, image: img })),
            ];

            for (const item of allImages) {
            if (!item.image?.uri) continue;

            const formData = new FormData();
            formData.append("file", {
                uri: item.image.uri,
                type: "image/jpeg",
                name: `${item.label.replace(" ", "_")}_${Date.now()}.jpg`,
            });
            formData.append("upload_preset", "zamrent");

            const cloudRes = await fetch(
                "https://api.cloudinary.com/v1_1/dcq19o3if/image/upload",
                { method: "POST", body: formData }
            );
            const data = await cloudRes.json();

            if (!cloudRes.ok) {
                throw new Error(data.error?.message || "Cloudinary upload failed");
            }

            uploadedImages.push({
                label: item.label,
                url: data.secure_url,
                public_id: data.public_id,
            });
            }

            console.log("Uploaded images from Cloudinary:", uploadedImages);

            Alert.alert(
            "Success",
            "Airtel number logged. Images uploaded to Cloudinary and URLs logged in console."
            );
            router.back(); // optional navigation
        } catch (err) {
            console.error("Error uploading images:", err);
            Alert.alert("Upload Failed", err.message);
        }
        };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Basic Verification</Text>
      <Text style={styles.fee}>Fee: K35 (Airtel Money only)</Text>

      <Text style={styles.label}>Airtel Money Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Airtel number"
        keyboardType="phone-pad"
        value={airtelNumber}
        onChangeText={setAirtelNumber}
      />

      <Text style={styles.label}>Upload ID (Front & Back)</Text>
      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setIdFront)}>
          <Text>ID Front</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setIdBack)}>
          <Text>ID Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Selfie with ID (Front & Back)</Text>
      <View style={styles.uploadRow}>
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setSelfieFront)}>
          <Text>Selfie Front</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setSelfieBack)}>
          <Text>Selfie Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Property Photos (3)</Text>
      <View style={styles.uploadRow}>
        {propertyPics.map((pic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.uploadButton}
            onPress={() => pickPropertyImage(index)}
          >
            <Text>{pic ? "Uploaded" : `Photo ${index + 1}`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  fee: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    color: "#2a2a72",
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  uploadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  uploadButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: "#2a2a72",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
