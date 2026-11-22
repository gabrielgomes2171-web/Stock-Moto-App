import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter, useFocusEffect } from 'expo-router';

import { listarCategoriasFirebase } from '../firebase/categoriasFirebase';

export default function Estoque(){
    const router = useRouter();

    const [marcas, setMarcas] = useState<any[]>([]);
    const [acessorios, setAcessorios] = useState<any[]>([]);

    // Recarrega toda vez que a tela volta ao foco (ex: depois de adicionar)
    useFocusEffect(
      useCallback(() => {
        carregar();
      }, [])
    );

    async function carregar() {
      try {
        const [listaMarcas, listaAcessorios] = await Promise.all([
          listarCategoriasFirebase('marca'),
          listarCategoriasFirebase('acessorio'),
        ]);
        setMarcas(listaMarcas as any[]);
        setAcessorios(listaAcessorios as any[]);
      } catch (error) {
        console.log(error);
      }
    }

    return(

        <View style={styles.container}>
            <Header title='Meu Estoque' showSettings />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => router.push('/adicionarcategoria')}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.addButtonText}>
                    ADICIONAR MARCA, MODELO OU ACESSÓRIO
                  </Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>MARCAS DE MOTOS</Text>
                <Text style={styles.subtitle}>Pesquise por Marcas</Text>

                <View style={[styles.grid, marcas.length === 0 && styles.gridCenter]}>

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

                {marcas.map((marca) => (
                  <TouchableOpacity
                    key={marca.id}
                    style={styles.brandCard}
                    onPress={() =>
                      router.push({
                        pathname: '/marca',
                        params: { nome: marca.nome, imagem: marca.imagem || '' },
                      })
                    }
                  >
                    <CardImagem uri={marca.imagem} style={styles.brandImage} />
                    <Text style={styles.cardLabel}>{marca.nome}</Text>
                  </TouchableOpacity>
                ))}

                </View>

                <Text style={styles.sectionTitle}>ACESSÓRIOS</Text>

                <View style={styles.grid}>

                    <TouchableOpacity
                      style={styles.accessoryCard}
                      onPress={() => router.push('/capacetes')}
                    >
                        <Image
                            source={require('../assets/images/capacete.png')}
                            style={styles.accessoryImage}
                        />
                        <Text style={styles.cardLabel}>CAPACETES</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.accessoryCard}
                    onPress={() => router.push('/bau')}
                    >
                        <Image
                            source={require('../assets/images/bau.png')}
                            style={styles.accessoryImage}
                        />
                        <Text style={styles.cardLabel}>BAÚ</Text>
                    </TouchableOpacity>

                    {acessorios.map((acessorio) => (
                      <TouchableOpacity
                        key={acessorio.id}
                        style={styles.accessoryCard}
                        onPress={() =>
                          router.push({
                            pathname: '/itensestoque',
                            params: {
                              tipo: 'acessorio',
                              nome: acessorio.nome,
                              imagem: acessorio.imagem || '',
                            },
                          })
                        }
                      >
                        <CardImagem uri={acessorio.imagem} style={styles.accessoryImage} />
                        <Text style={styles.cardLabel}>{acessorio.nome}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <Footer active='estoque' />
            </View>
    );
}

function CardImagem({ uri, style }: { uri?: string; style: any }) {
  if (uri) {
    return <Image source={{ uri }} style={style} />;
  }
  return (
    <View style={[style, styles.imagePlaceholder]}>
      <Ionicons name="image-outline" size={36} color="#BBB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 0,
  },

  content: {
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 160,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F47B20",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 6,
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridCenter: {
    justifyContent: "center",
  },

  brandCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
  },

  brandImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },

  accessoryCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
  },

  accessoryImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  cardLabel: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
});
