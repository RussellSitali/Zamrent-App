
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ComingSoonScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#2a2a72" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Main content */}
      <Ionicons name="time-outline" size={64} color="#2a2a72" style={{ marginTop: 40 }} />
      
      <Text style={styles.title}>Coming Soon</Text>
      
      <Text style={styles.subtitle}>
        This feature is currently under development.
      </Text>

      <Text style={styles.note}>
        We’re working hard to bring identity verification to ZamRent 🚀
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backText: {
    color: "#2a2a72",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    color: "#2a2a72",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#555",
  },
  note: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#777",
  },
});




// // Code starts here

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Alert,
//   Image
// } from "react-native";
// import { useRouter } from "expo-router";
// import * as ImagePicker from "expo-image-picker";

// export default function BasicVerificationScreen() {
//   const router = useRouter();

//   const [airtelNumber, setAirtelNumber] = useState("");
//   const [images, setImages] = useState([]); 

//   const pickImages = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 1,
//   });
//     if (!result.canceled) {
//       setImages((prev) => [...prev, ...result.assets]);
//     }
//       console.log("These are the assests ", result.assets)
//     }

//      const removeImage = (index) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     if (!airtelNumber) {
//       Alert.alert("Error", "Please enter your Airtel Money number");
//       return;
//     }

//     if (images.length !== 7) {
//       Alert.alert(
//         "Error",
//         "Please upload exactly 7 photos:\n2 ID/NRC, 2 Selfies, 3 Property photos"
//       );
//       return;
//     }

//     console.log("Airtel Number:", airtelNumber);

//     try {
//       const uploadedImages = [];

//       for (let i = 0; i < images.length; i++) {
//         const img = images[i];

//         const response = await fetch(img.uri);
//         const blob = await response.blob();

//         const formData = new FormData();
//         formData.append("file", blob);
//         formData.append("upload_preset", "zamrent");

//         const cloudRes = await fetch(
//           "https://api.cloudinary.com/v1_1/dcq19o3if/image/upload",
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         const data = await cloudRes.json();
//         console.log(data);

//         if (!cloudRes.ok) {
//           console.log("Cloudinary error response:", data);
//           throw new Error(data.error?.message || "Cloudinary upload failed");
//         }

//         uploadedImages.push({
//           url: data.secure_url,
//           public_id: data.public_id,
//         });
//       }

//       console.log("Uploaded verification images:", uploadedImages);

//       Alert.alert(
//         "Submitted",
//         "Verification submitted successfully. Status: Pending review."
//       );

//       router.back();
//     } catch (err) {
//       console.error("Upload error:", err);
//       Alert.alert("Upload Failed", err.message);
//     }
//   };

//     return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Basic Verification</Text>
//       <Text style={styles.fee}>Fee: K35 (Airtel Money only)</Text>

//       <Text style={styles.instructions}>
//         Please upload exactly 7 clear photos:
//         {"\n"}2: ID or NRC (Front & Back)
//         {"\n"}2: Selfies holding ID/NRC(front and back)
//         {"\n"}3: Property photos
//       </Text>

//       <Text style={styles.label}>Airtel Money Number</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Airtel number"
//         keyboardType="phone-pad"
//         value={airtelNumber}
//         onChangeText={setAirtelNumber}
//       />

//       <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
//         <Text style={styles.uploadText}>
//           {images.length > 0
//             ? `${images.length} photos selected`
//             : "Select 7 Photos"}
//         </Text>
//       </TouchableOpacity>

      
//                 {images.length > 0 && (
//                   <View style={styles.imagePreviewContainer}>
//                     {images.map((img, index) => (
//                       <View key={index} style={{ position: "relative", marginRight: 10 }}>
//                         <Image source={{ uri: img.uri }} style={styles.imagePreview} />
//                         <TouchableOpacity
//                           style={styles.removeImageButton}
//                           onPress={() => removeImage(index)}
//                         >
//                           <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </View>
//                 )}
      

//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitText}>Submit Verification</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//  container: {
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   fee: {
//     textAlign: "center",
//     fontSize: 16,
//     marginBottom: 12,
//     color: "#2a2a72",
//     fontWeight: "600",
//   },
//   instructions: {
//     fontSize: 14,
//     marginBottom: 15,
//     color: "#444",
//     backgroundColor: "#eaeaea",
//     padding: 12,
//     borderRadius: 8,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: "#fff",
//     marginBottom: 15,
//   },
//   uploadButton: {
//     backgroundColor: "#ddd",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   uploadText: {
//     fontWeight: "600",
//   },
//   submitButton: {
//     backgroundColor: "#2a2a72",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   submitText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   removeImageButton: {
//     position: "absolute",
//     top: -8,
//     right: -8,
//     backgroundColor: "red",
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   imagePreviewContainer: {
//     flexDirection: "row",
//     marginVertical: 10,
//     flexWrap: "wrap",
//   },
//   imagePreview: { width: 100, height: 100, borderRadius: 5 },
// })


// // code ends here