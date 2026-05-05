import { View, Text, StyleSheet, Image, TouchableOpacity, } from "react-native";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EstoqueHonda() {
     return (

        <View style={styles.container}>

            <Header title="Estoque Honda" showSettings />

            <View style={styles.content}>

                <View style={styles.brandContainer}>
                    <Image
                        source={require("../assets/images/honda.png")}
                        style={styles.brandLogo}
                        resizeMode="contain"
                    />
                    <Text style={styles.brandText}>ESCOLHA O MODELO</Text>
                </View>

                <View style={styles.grid}>

                    <TouchableOpacity style={styles.card}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>CG 160 START</Text>
                    </View>

                    <Image
                        source={require("../assets/images/cg160start.png")}
                        style={styles.image}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                    <View style={styles.badge}>
                       <Text style={styles.badgeText}>CG 160 FAN</Text>
                    </View>
                    
                    <Image
                      source={require("../assets/images/cg160fan.png")}
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
    justifyContent: "space-between",
  },
  
  content: {
    padding: 16,
    flex: 1,
  },

  brandContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  brandLogo: {
    width: 120,
    height: 40,
    marginBottom: 8,
  },

  brandText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    padding: 10,
    alignItems: "center",
  },

  badge: {
    backgroundColor: "#FF7A00",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },

  badgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    height: 80,
    resizeMode: "contain",
  },
});
  