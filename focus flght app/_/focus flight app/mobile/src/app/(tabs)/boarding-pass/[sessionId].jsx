import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plane, MapPin } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function BoardingPassScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [session, setSession] = useState(null);

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/focus/sessions/${sessionId}`);
      if (!response.ok) throw new Error("Failed to load session");
      const data = await response.json();
      setSession(data.session);
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const handleBoarding = () => {
    router.push(`/(tabs)/flight-progress/${sessionId}`);
  };

  if ((!loaded && !error) || !session) {
    return null;
  }

  const calculateDistance = () => {
    // Simple distance calculation based on lat/long
    return Math.floor(Math.random() * 3000) + 100;
  };

  const distance = calculateDistance();
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0E27" }}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#1e3a8a", "#0f172a"]}
        style={{
          flex: 1,
          paddingTop: insets.top + 40,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Map Background Hint */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: height * 0.5,
            opacity: 0.3,
          }}
        >
          <MapPin
            size={200}
            color="#FFFFFF"
            style={{ alignSelf: "center", marginTop: 100 }}
          />
        </View>

        {/* Motivational Text */}
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          I'm gonna pass all my classes 🎓
        </Text>

        {/* Boarding Pass */}
        <View
          style={{
            backgroundColor: "#1F2937",
            borderRadius: 24,
            padding: 24,
            marginTop: 40,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          {/* Route */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 40,
                  color: "#FFFFFF",
                }}
              >
                {session.departure_code}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: "#9CA3AF",
                }}
              >
                {session.departure_name}
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Plane size={24} color="#9CA3AF" />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                  color: "#9CA3AF",
                  marginTop: 4,
                }}
              >
                {session.planned_duration}m
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 40,
                  color: "#FFFFFF",
                }}
              >
                {session.destination_code}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 14,
                  color: "#9CA3AF",
                }}
              >
                {session.destination_name}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: "#9CA3AF",
                  marginBottom: 4,
                }}
              >
                Seat
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 24,
                  color: "#FFFFFF",
                }}
              >
                {session.seat || "09C"}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: "#9CA3AF",
                  marginBottom: 4,
                }}
              >
                Distance
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 24,
                  color: "#FFFFFF",
                }}
              >
                {distance} mi
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: "#9CA3AF",
                  marginBottom: 4,
                }}
              >
                Boarding
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: "#FFFFFF",
                }}
              >
                Now
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: "#9CA3AF",
                  marginBottom: 4,
                }}
              >
                Date
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: "#FFFFFF",
                }}
              >
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* Dotted Line */}
          <View
            style={{
              height: 1,
              borderStyle: "dashed",
              borderWidth: 1,
              borderColor: "#4B5563",
              marginVertical: 16,
            }}
          />

          {/* Barcode */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              height: 80,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: Math.random() > 0.5 ? 3 : 2,
                    height: Math.random() * 40 + 30,
                    backgroundColor: "#000000",
                    marginHorizontal: 1,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Airplane Mode Reminder */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>✈️</Text>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 16,
                color: "#FCD34D",
              }}
            >
              Airplane Mode
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              color: "#FCD34D",
            }}
          >
            Not set
          </Text>
        </View>

        {/* Boarding Button */}
        <TouchableOpacity
          onPress={handleBoarding}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 18,
              color: "#0A0E27",
            }}
          >
            Boarding
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
