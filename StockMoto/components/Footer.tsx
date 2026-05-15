import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  active?: "estoque" | "cadastrar" | "inicial" | "orcamentos" | "alertas";
};

export default function Footer({ active }: Props) {
  const router = useRouter();

  const renderIcon = (
    name: string,
    label: string,
    icon: (isActive: boolean) => React.ReactNode,
    route: any
  ) => {
    const isActive = active === name;

    return (
      <TouchableOpacity 
        onPress={() => router.replace(route)}
        activeOpacity={0.7}
      >
        <View style={styles.tabContainer}>

          {isActive && <View style={styles.activeCircle} />}
          
          <View style={styles.iconContainer}>
            {icon(isActive)}
          </View>

          <Text style={[styles.label, isActive && styles.activeLabel]}>
            {label}
          </Text>

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={["bottom"]}>
    <View style={styles.footer}>
      
      {renderIcon(
        "estoque",
        "ESTOQUE",
        (isActive) => (
          <MaterialIcons
            name="inventory"
            size={24}
            color={isActive ? "#F47B20" : "#777"}
          />
        ),
        "/estoque"
      )}

      {renderIcon(
        "cadastrar",
        "CADASTRAR",
        (isActive) => (
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={isActive ? "#F47B20" : "#777"}
          />
        ),
        "/cadastrar"
      )}

      {renderIcon(
        "inicial",
        "INÍCIO",
        (isActive) => (
          <Ionicons
            name="grid"
            size={24}
            color={isActive ? "#F47B20" : "#777"}
          />
        ),
        "/inicial"
      )}

      {renderIcon(
        "orcamentos",
        "ORÇAMENTOS",
        (isActive) => (
          <Feather
            name="dollar-sign"
            size={24}
            color={isActive ? "#F47B20" : "#777"}
          />
        ),
        "/orcamentos"
      )}

      {renderIcon(
        "alertas",
        "ALERTAS",
        (isActive) => (
          <Ionicons
            name="warning-outline"
            size={24}
            color={isActive ? "#F47B20" : "#777"}
          />
        ),
        "/alertas"
      )}

    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    zIndex:999
  },

  footer: {
    width: "98%",
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },

  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 70,
  },

  iconContainer: {zIndex: 2
  },
  activeCircle: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
     backgroundColor: "#FFF3E9",
     top: -5
   },

  label: {
    fontSize: 9,
    color: "#777",
    marginTop: 10,
  },

  activeLabel: {
    color: "#F47B20",
    fontWeight: "bold",
    
  },
});