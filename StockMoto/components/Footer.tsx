import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  active?: "estoque" | "cadastrar" | "inicial" | "orcamentos" | "alertas";
};

export default function Footer({ active }: Props) {
  const router = useRouter();

  const renderIcon = (
    name: string,
    icon: (isActive: boolean) => React.ReactNode,
    route: any
  ) => {
    const isActive = active === name;

    return (
      <TouchableOpacity onPress={() => router.replace(route)}>
        <View style={isActive ? styles.activeTab : undefined}>
          {icon(isActive)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.footer}>
      
      {renderIcon(
        "estoque",
        (isActive) => (
          <MaterialIcons
            name="inventory"
            size={24}
            color={isActive ? "#F47B20" : "#555"}
          />
        ),
        "/estoque"
      )}

      {renderIcon(
        "cadastrar",
        (isActive) => (
          <Ionicons
            name="add-circle-outline"
            size={26}
            color={isActive ? "#F47B20" : "#555"}
          />
        ),
        "/cadastrar"
      )}

      {renderIcon(
        "inicial",
        (isActive) => (
          <Ionicons
            name="grid"
            size={24}
            color={isActive ? "#F47B20" : "#555"}
          />
        ),
        "/inicial"
      )}

      {renderIcon(
        "orcamentos",
        (isActive) => (
          <Feather
            name="dollar-sign"
            size={22}
            color={isActive ? "#F47B20" : "#555"}
          />
        ),
        "/orcamentos"
      )}

      {renderIcon(
        "alertas",
        (isActive) => (
          <Ionicons
            name="warning-outline"
            size={24}
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
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#fff3e9",
    padding: 0,
    borderRadius: 12,
  },
});