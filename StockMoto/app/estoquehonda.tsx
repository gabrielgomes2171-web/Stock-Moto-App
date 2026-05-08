import { View, Text, StyleSheet, Image, TouchableOpacity, } from "react-native";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "expo-router";

export default function EstoqueHonda() {
    const router = useRouter();
    return (

        <View style={styles.container}>

            <Header title="Estoque Honda" showSettings />

            <View style={styles.content}>

                <View style={styles.brandBox}>
                    
                    <Image
                        source={require("../assets/images/honda.png")}
                        style={styles.brandLogo}
                    />

                    <View style={styles.brandTextContainer}>
                    <Text style={styles.brandTitle}>HONDA</Text>
                    <Text style={styles.brandSubtitle}>ESCOLHA O MODELO</Text>
                </View>
              </View>
              

                <View style={styles.grid}>

                    <TouchableOpacity 
                    style={styles.card}
                    onPress={() => router.push("/estoquestart160")}
                    >
                      
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>CG 160 START</Text>
                    </View>

                    <Image
                        source={require("../assets/images/cg160start.png")}
                        style={styles.image}
                    />
                </TouchableOpacity>

                    <TouchableOpacity 
                    style={styles.card}
                    onPress={() => router.push("/estoquefan160")}
                    >
                      
                    <View style={styles.badge}>
                       <Text style={styles.badgeText}>CG 160 FAN</Text>
                    </View>
                    
                    <Image
                      source={require("../assets/images/cg160fan.png")}
                       style={styles.image}
                    />
                </TouchableOpacity>

                <TouchableOpacity 
                style={styles.card}
                onPress={() => router.push("/estoquetitan160")}
                  >
                    
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>CG 160 TITAN</Text>
                  </View>

                  <Image
                    source={require("../assets/images/cg160titan.png")}
                    style={styles.image}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                    <View style={styles.badge}>
                       <Text style={styles.badgeText}>CG 160 CARGO</Text> 
                    </View>

                    <Image
                        source={require("../assets/images/cg160cargo.png")}
                        style={styles.image}
                    />
                </TouchableOpacity>

            </View>
        </View>
        <Footer active="estoque" />
        </View>
     );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  
  content: {
    padding: 16,
    flex: 1,
  },

  brandBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },

  brandLogo: {
    width: 90,
    height: 50,
    marginBottom: 10,
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 5,
  },

  brandTextContainer: {
  justifyContent: "center",
  },

  brandTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  brandSubtitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 40,
    padding: 20,
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -8,
    left: -8,
    backgroundColor: "#FF7A00",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 1,
  },

  badgeText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    marginTop: 10,
  },
});
  