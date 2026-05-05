import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'expo-router';

export default function Estoque(){
    const router = useRouter();
    return(

        <View style={styles.container}>
            <Header title='Meu Estoque' showSettings />
            
            <View style={styles.content}>

                <Text style={styles.sectionTitle}>MARCAS DE MOTOS</Text>
                <Text style={styles.subtitle}>Pesquise por Marcas</Text>

                <View style={styles.row}>

                <TouchableOpacity
                  style={styles.brandCard}
                  onPress={() => router.push('/estoquehonda')}
                >
                    <Image
                        source={require('../assets/images/honda.png')}
                        style={styles.brandImage}
                    />
                    <Text style={styles.cardLabel}>HONDA</Text>
                </TouchableOpacity>

                </View>

                <Text style={styles.sectionTitle}>ACESSÓRIOS</Text>

                <View style={styles.row}>

                    <View style={styles.accessoryCard}>
                        <Image
                            source={require('../assets/images/capacete.png')}
                            style={styles.accessoryImage}
                        />
                        <Text style={styles.cardLabel}>CAPACETES</Text>
                    </View>

                    <View style={styles.accessoryCard}>
                        <Image
                            source={require('../assets/images/bau.png')}
                            style={styles.accessoryImage}
                        />
                        <Text style={styles.cardLabel}>BAÚ</Text>
                    </View>
                </View>
            </View>
            <Footer active='estoque' />   
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 0,
  },

  header: {
    backgroundColor: "#F47B20",
    padding: 20,
    marginBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  content: {
    paddingHorizontal: 30,
    paddingTop: 0,
    paddingBottom: 100,
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
    textAlign: "center",
    paddingBottom: 15,
  },

  subtitle: {
    color: "#888",
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
    paddingBottom: 2,
  },

  brandCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    width: "48%",
    marginBottom: 2,
    alignSelf: "center",
  },

  brandText: {
    fontSize: 15,
    fontWeight: "800",
  },

  brandImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  accessoryCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "48%",
  },

  accessoryImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },

  cardLabel: {
    fontSize: 15,
    fontWeight: "800",
  },
});
