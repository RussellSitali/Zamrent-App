
import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function FilterModal({
  visible,
  onClose,
  price,
  setPrice,
  bedrooms,
  setBedrooms,
  bedspaces,
  setBedspaces,
  propertyType,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Filter Options</Text>

          <TextInput
            placeholder="Max Price"
            placeholderTextColor="#000"
            keyboardType="numeric"
            value={price.toString()}
            onChangeText={setPrice}
            style={styles.input}
          />

          {propertyType === "house" && (
            <TextInput
              placeholder="Rooms"
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={bedrooms.toString()}
              onChangeText={setBedrooms}
              style={styles.input}
            />
          )}

          {propertyType === "boardinghouse" && (
            <TextInput
              placeholder="Bedspaces"
              placeholderTextColor="#000"
              keyboardType="numeric"
              value={bedspaces.toString()}
              onChangeText={setBedspaces}
              style={styles.input}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    width: "100%",
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
