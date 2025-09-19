import { View, Text, Button, Linking, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SupportScreen() {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL("tel:+260970337049");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@zamrent.com"); // not real email big man
  };

  const handleWhatsApp = () => {
    const phoneNumber = "+260570003287";
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleLinkedIn = () => {
    Linking.openURL("https://www.linkedin.com/in/your-profile");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {/* Custom Back Button */}
      <Button title="⬅ Back" onPress={() => router.back()} />

      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20, marginTop: 10 }}>
        Need Help?
      </Text>

      {/* Contact Section */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Contact Support</Text>
      <Button title="📞 Call Us" onPress={handleCall} />
      <Button title="📧 Email Us" onPress={handleEmail} />
      <Button title="💬 WhatsApp Us" onPress={handleWhatsApp} />
      <Button title="🔗 LinkedIn" onPress={handleLinkedIn} />

      {/* FAQs */}
      <Text style={{ fontSize: 18, marginVertical: 20 }}>FAQs</Text>
      <Text>- How do I search for a house? Use the search bar on Home.</Text>
      <Text>- How do I list my property? Go to Profile > Add Listing.</Text>
      <Text>- How do I reset my password? Use 'Forgot Password' on Sign In.</Text>

      {/* Report a Problem */}
      <TouchableOpacity
        style={{
          marginTop: 30,
          padding: 15,
          backgroundColor: "#2f95dc",
          borderRadius: 8,
        }}
        onPress={handleEmail}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          🛠 Report a Problem
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
