import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../contexts/UserContext";
import { Image } from "react-native";

type Props = {
  title: string;
  showSettings?: boolean;
  showBack?: boolean;
};

export default function Header({
  title,
  showSettings = false,
  showBack = false,
}: Props) {

  const router = useRouter();

  const { nome, imagem } = useUser();

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>

      <View style={styles.header}>

        <View style={styles.headerTop}>

          <View style={styles.left}>

            {showBack && (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.profile}
              onPress={() => router.push("/perfil")}
            >

              <View style={styles.avatar}>

                {imagem ? (
                  <Image
                    source={{ uri: imagem }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {nome.charAt(0)}
                  </Text>
                )}

              </View>

              <Text style={styles.brand}>
                {nome}
              </Text>

            </TouchableOpacity>

          </View>

          {showSettings && (
            <TouchableOpacity
              onPress={() =>
                router.push("/configuracoes")
              }
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color="#000"
              />
            </TouchableOpacity>
          )}

        </View>

        <Text style={styles.title}>
          {title}
        </Text>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {
    backgroundColor: "#F47B20",
  },

  header: {
    backgroundColor: "#F47B20",
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  profile: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },

  brand: {
    color: "#fff",
    fontWeight: "bold",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

});