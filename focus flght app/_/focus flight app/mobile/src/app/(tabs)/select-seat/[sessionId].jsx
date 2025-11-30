import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plane } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

const SeatButton = ({ row, column, isSelected, isOccupied, onPress }) => {
  const getBackgroundColor = () => {
    if (isOccupied) return "#4A5568";
    if (isSelected) return "#007BFF";
    return "#2D3748";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isOccupied}
      style={{
        width: 50,
        height: 50,
        backgroundColor: getBackgroundColor(),
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
        borderWidth: isSelected ? 2 : 0,
        borderColor: "#FFFFFF",
      }}
    >
      <Text
        style={{
          fontFamily: "Poppins_600SemiBold",
          fontSize: 14,
          color: isOccupied ? "#718096" : "#FFFFFF",
        }}
      >
        {row}
        {column}
      </Text>
    </TouchableOpacity>
  );
};

export default function SelectSeatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();
  const [session, setSession] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState(new Set());

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

      // Simulate some occupied seats
      const occupied = new Set();
      const randomSeats = Math.floor(Math.random() * 15) + 5;
      for (let i = 0; i < randomSeats; i++) {
        const row = String(Math.floor(Math.random() * 30) + 1).padStart(2, "0");
        const col = ["A", "C", "D", "F"][Math.floor(Math.random() * 4)];
        occupied.add(`${row}${col}`);
      }
      setOccupiedSeats(occupied);
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const handleConfirmSeat = async () => {
    if (!selectedSeat) {
      alert("Please select a seat");
      return;
    }

    try {
      const response = await fetch(`/api/focus/sessions/${sessionId}/seat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seat: selectedSeat }),
      });

      if (!response.ok) throw new Error("Failed to save seat");

      router.push(`/(tabs)/boarding-pass/${sessionId}`);
    } catch (error) {
      console.error("Error saving seat:", error);
      alert("Failed to save seat. Please try again.");
    }
  };

  if ((!loaded && !error) || !session) {
    return null;
  }

  const rows = Array.from({ length: 30 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const columns = ["A", "C", "D", "F"];

  return (
    <View style={{ flex: 1, backgroundColor: "#1A202C" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 28,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Select Your Seat
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 16,
            color: "#A0AEC0",
            textAlign: "center",
          }}
        >
          {session.departure_code} → {session.destination_code}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 14,
            color: "#CBD5E0",
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Perfect for the beginning of your focus session!
        </Text>
      </View>

      {/* Plane Outline */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 140,
          alignItems: "center",
        }}
      >
        {/* Cockpit */}
        <View
          style={{
            width: width - 80,
            height: 80,
            backgroundColor: "#2D3748",
            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
            marginBottom: 8,
          }}
        />

        {/* Cabin */}
        <View
          style={{
            width: width - 80,
            backgroundColor: "#2D3748",
            borderRadius: 20,
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}
        >
          {/* Column Headers */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {columns.map((col) => (
              <View key={col} style={{ width: 58, alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    fontSize: 16,
                    color: "#A0AEC0",
                  }}
                >
                  {col}
                </Text>
              </View>
            ))}
          </View>

          {/* Seats */}
          {rows.map((row) => (
            <View
              key={row}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                {columns.map((col) => {
                  const seatId = `${row}${col}`;
                  return (
                    <SeatButton
                      key={seatId}
                      row={row}
                      column={col}
                      isSelected={selectedSeat === seatId}
                      isOccupied={occupiedSeats.has(seatId)}
                      onPress={() => setSelectedSeat(seatId)}
                    />
                  );
                })}
              </View>

              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 14,
                  color: "#718096",
                  marginLeft: 12,
                  width: 30,
                }}
              >
                {row}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend & Confirm Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#1A202C",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: "#2D3748",
        }}
      >
        {/* Legend */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#2D3748",
                borderRadius: 4,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: "#A0AEC0",
              }}
            >
              Available
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#007BFF",
                borderRadius: 4,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: "#A0AEC0",
              }}
            >
              Selected
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#4A5568",
                borderRadius: 4,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 12,
                color: "#A0AEC0",
              }}
            >
              Occupied
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleConfirmSeat}
          disabled={!selectedSeat}
          style={{
            backgroundColor: selectedSeat ? "#007BFF" : "#4A5568",
            borderRadius: 16,
            padding: 18,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 18,
              color: "#FFFFFF",
            }}
          >
            {selectedSeat ? `Confirm Seat ${selectedSeat}` : "Select a Seat"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
