import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, Clock, ChevronDown, Plane } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useRef } from "react";

const DurationChip = ({ minutes, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: selected ? "#007BFF" : "#F1F4F6",
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginRight: 12,
      marginBottom: 12,
    }}
  >
    <Text
      style={{
        fontFamily: "Poppins_600SemiBold",
        fontSize: 16,
        color: selected ? "#FFFFFF" : "#384254",
      }}
    >
      {minutes} min
    </Text>
  </TouchableOpacity>
);

const CategoryCard = ({ name, icon, color, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: selected ? `${color}15` : "#FFFFFF",
      borderWidth: 2,
      borderColor: selected ? color : "#E5E9F0",
      borderRadius: 16,
      padding: 20,
      flex: 1,
      marginHorizontal: 6,
      marginBottom: 12,
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 48,
        height: 48,
        backgroundColor: `${color}20`,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      <Text style={{ fontSize: 24 }}>{icon}</Text>
    </View>
    <Text
      style={{
        fontFamily: "Poppins_600SemiBold",
        fontSize: 14,
        color: selected ? color : "#384254",
        textAlign: "center",
      }}
    >
      {name}
    </Text>
  </TouchableOpacity>
);

const CityItem = ({ city, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(city)}
    style={{
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E9F0",
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#007BFF15",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 14,
            color: "#007BFF",
          }}
        >
          {city.code}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: "#262F40",
          }}
        >
          {city.name}
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 13,
            color: "#9AA3B1",
          }}
        >
          {city.country}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function BookFlightScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);
  const [duration, setDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [goalText, setGoalText] = useState("");
  const [sheetType, setSheetType] = useState(null); // 'departure' or 'destination'

  const bottomSheetRef = useRef(null);
  const snapPoints = ["75%"];

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    loadCities();
    loadCategories();
  }, []);

  const loadCities = async () => {
    try {
      const response = await fetch("/api/focus/cities");
      if (!response.ok) throw new Error("Failed to load cities");
      const data = await response.json();
      setCities(data.cities || []);
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/focus/categories");
      if (!response.ok) throw new Error("Failed to load categories");
      const data = await response.json();
      setCategories(data.categories || []);
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0].id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const openCitySheet = (type) => {
    setSheetType(type);
    bottomSheetRef.current?.expand();
  };

  const selectCity = (city) => {
    if (sheetType === "departure") {
      setDeparture(city);
    } else {
      setDestination(city);
    }
    bottomSheetRef.current?.close();
  };

  const handleBookFlight = async () => {
    if (!departure || !destination || !selectedCategory) {
      alert("Please select departure, destination, and category");
      return;
    }

    const finalDuration = customDuration ? parseInt(customDuration) : duration;

    try {
      const response = await fetch("/api/focus/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departure_city_id: departure.id,
          destination_city_id: destination.id,
          category_id: selectedCategory,
          planned_duration: finalDuration,
          goal_text: goalText,
        }),
      });

      if (!response.ok) throw new Error("Failed to book flight");
      const data = await response.json();

      // Navigate to seat selection instead of directly to flight progress
      router.push(`/(tabs)/select-seat/${data.session.id}`);
    } catch (error) {
      console.error("Error booking flight:", error);
      alert("Failed to book flight. Please try again.");
    }
  };

  if (!loaded && !error) {
    return null;
  }

  const iconMap = {
    briefcase: "💼",
    "book-open": "📖",
    rocket: "🚀",
    book: "📚",
    dumbbell: "🏋️",
    palette: "🎨",
  };

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
            Book Your Flight
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              color: "#D8DDE6",
              marginTop: 8,
            }}
          >
            Choose your focus journey
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
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            {/* Flight Route */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: "#262F40",
                  marginBottom: 16,
                }}
              >
                Flight Route
              </Text>

              <TouchableOpacity
                onPress={() => openCitySheet("departure")}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#E5E9F0",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MapPin size={20} color="#007BFF" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 12,
                      color: "#9AA3B1",
                      marginBottom: 4,
                    }}
                  >
                    Departure
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 16,
                      color: departure ? "#262F40" : "#9AA3B1",
                    }}
                  >
                    {departure
                      ? `${departure.code} - ${departure.name}`
                      : "Select city"}
                  </Text>
                </View>
                <ChevronDown size={20} color="#9AA3B1" />
              </TouchableOpacity>

              <View
                style={{
                  alignItems: "center",
                  marginVertical: 8,
                }}
              >
                <Plane
                  size={24}
                  color="#007BFF"
                  style={{ transform: [{ rotate: "90deg" }] }}
                />
              </View>

              <TouchableOpacity
                onPress={() => openCitySheet("destination")}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#E5E9F0",
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MapPin size={20} color="#10B981" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 12,
                      color: "#9AA3B1",
                      marginBottom: 4,
                    }}
                  >
                    Destination
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins_600SemiBold",
                      fontSize: 16,
                      color: destination ? "#262F40" : "#9AA3B1",
                    }}
                  >
                    {destination
                      ? `${destination.code} - ${destination.name}`
                      : "Select city"}
                  </Text>
                </View>
                <ChevronDown size={20} color="#9AA3B1" />
              </TouchableOpacity>
            </View>

            {/* Duration */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: "#262F40",
                  marginBottom: 16,
                }}
              >
                Focus Duration
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {[25, 45, 60, 90, 120, 300, 480].map((min) => (
                  <DurationChip
                    key={min}
                    minutes={min}
                    selected={duration === min && !customDuration}
                    onPress={() => {
                      setDuration(min);
                      setCustomDuration("");
                    }}
                  />
                ))}
              </View>

              <TextInput
                placeholder="Custom duration (minutes)"
                value={customDuration}
                onChangeText={setCustomDuration}
                keyboardType="number-pad"
                style={{
                  backgroundColor: "#F1F4F6",
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Poppins_500Medium",
                  fontSize: 16,
                  color: "#262F40",
                  marginTop: 12,
                }}
              />
            </View>

            {/* Category */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: "#262F40",
                  marginBottom: 16,
                }}
              >
                Focus Category
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginHorizontal: -6,
                }}
              >
                {categories.map((cat) => (
                  <View key={cat.id} style={{ width: "50%" }}>
                    <CategoryCard
                      name={cat.name}
                      icon={iconMap[cat.icon] || "✈️"}
                      color={cat.color}
                      selected={selectedCategory === cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Optional Goal */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 18,
                  color: "#262F40",
                  marginBottom: 16,
                }}
              >
                Focus Goal (Optional)
              </Text>

              <TextInput
                placeholder="What are you focusing on?"
                value={goalText}
                onChangeText={setGoalText}
                multiline
                style={{
                  backgroundColor: "#F1F4F6",
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Poppins_400Regular",
                  fontSize: 16,
                  color: "#262F40",
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Book Button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            borderTopWidth: 1,
            borderTopColor: "#E5E9F0",
          }}
        >
          <TouchableOpacity
            onPress={handleBookFlight}
            style={{
              backgroundColor: "#007BFF",
              borderRadius: 16,
              padding: 18,
              alignItems: "center",
              shadowColor: "#007BFF",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 18,
                color: "#FFFFFF",
              }}
            >
              Book Flight
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* City Selection Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: "#C9CDD7",
          width: 36,
          height: 4,
        }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E5E9F0",
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 20,
                color: "#262F40",
              }}
            >
              Select {sheetType === "departure" ? "Departure" : "Destination"}
            </Text>
          </View>

          <BottomSheetScrollView style={{ flex: 1 }}>
            {cities.map((city) => (
              <CityItem key={city.id} city={city} onSelect={selectCity} />
            ))}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
