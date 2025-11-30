import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, Plane } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import Svg, { Path, Circle, Line } from "react-native-svg";

const { width } = Dimensions.get("window");

const RouteCard = ({ route, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E5E9F0",
      padding: 16,
      marginBottom: 12,
    }}
  >
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          backgroundColor: "#007BFF15",
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Plane size={16} color="#007BFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: "#262F40",
          }}
        >
          {route.departure_code} → {route.destination_code}
        </Text>
      </View>
    </View>

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_400Regular",
          fontSize: 13,
          color: "#9AA3B1",
        }}
      >
        {route.flight_count} flights
      </Text>
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 13,
          color: "#007BFF",
        }}
      >
        {route.total_minutes} min
      </Text>
    </View>
  </TouchableOpacity>
);

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [routes, setRoutes] = useState([]);

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await fetch("/api/focus/routes");
      if (!response.ok) throw new Error("Failed to load routes");
      const data = await response.json();
      setRoutes(data.routes || []);
    } catch (error) {
      console.error("Error loading routes:", error);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  // Simplified world map visualization
  const mapWidth = width - 40;
  const mapHeight = 300;

  return (
    <View style={{ flex: 1, backgroundColor: "#0F1117" }}>
      <StatusBar style="light" />

      <View style={{ paddingTop: insets.top, paddingHorizontal: 20 }}>
        <View style={{ paddingTop: 16, paddingBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 32,
              color: "#FFFFFF",
              lineHeight: 38,
            }}
          >
            Flight Map
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: "#D8DDE6",
              marginTop: 8,
            }}
          >
            Explore your focus routes
          </Text>
        </View>

        {/* Simplified Map Visualization */}
        <View
          style={{
            backgroundColor: "#171B23",
            borderWidth: 1,
            borderColor: "#232832",
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
          }}
        >
          <Svg width={mapWidth} height={mapHeight}>
            {/* Background */}
            <Circle
              cx={mapWidth / 2}
              cy={mapHeight / 2}
              r={120}
              fill="rgba(0, 123, 255, 0.1)"
            />

            {/* Sample flight routes */}
            {routes.slice(0, 5).map((route, index) => {
              const startX = Math.random() * (mapWidth - 100) + 50;
              const startY = Math.random() * (mapHeight - 100) + 50;
              const endX = Math.random() * (mapWidth - 100) + 50;
              const endY = Math.random() * (mapHeight - 100) + 50;
              const controlY = Math.min(startY, endY) - 40;

              return (
                <Path
                  key={index}
                  d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${controlY} ${endX} ${endY}`}
                  stroke="#007BFF"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
              );
            })}

            {/* Center icon */}
            <Circle
              cx={mapWidth / 2}
              cy={mapHeight / 2}
              r="20"
              fill="#007BFF"
            />
          </Svg>

          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            {routes.length} routes explored
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingTop: 32,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                color: "#262F40",
                marginBottom: 16,
              }}
            >
              Your Routes
            </Text>

            {routes.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#F8F9FA",
                  borderRadius: 12,
                  padding: 32,
                  alignItems: "center",
                }}
              >
                <MapPin
                  size={48}
                  color="#9AA3B1"
                  style={{ marginBottom: 12 }}
                />
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 16,
                    color: "#262F40",
                    marginBottom: 8,
                  }}
                >
                  No routes yet
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 14,
                    color: "#9AA3B1",
                    textAlign: "center",
                  }}
                >
                  Complete focus sessions to see your flight routes
                </Text>
              </View>
            ) : (
              routes.map((route, index) => (
                <RouteCard key={index} route={route} onPress={() => {}} />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
