import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
      <TouchableOpacity onPress={() => router.replace(route)}>
        <View style={styles.tabContainer}>
          
          <View style={isActive ? styles.activeTab : undefined}>
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
    <View style={styles.footer}>
      
      {renderIcon(
        "estoque",
        "ESTOQUE",
        (isActive) => (
          <MaterialIcons
            name="inventory"
            size={28}
            color={isActive ? "#F47B20" : "#555"}
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
            size={28}
            color={isActive ? "#F47B20" : "#555"}
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
            size={28}
            color={isActive ? "#F47B20" : "#555"}
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
            size={28}
            color={isActive ? "#F47B20" : "#555"}
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
            size={28}
            color={isActive ? "#F47B20" : "#555"}
          />
        ),
        "/alertas"
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 1,
    right: 0,
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: "#fff3e9",
    padding: 0,
    borderRadius: 12,
  },

  label: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },

  activeLabel: {
    color: "#F47B20",
    fontWeight: "bold",
  },
});