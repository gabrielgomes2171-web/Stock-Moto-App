import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import React, {
  useCallback,
  useState,
} from 'react';

import { useFocusEffect } from 'expo-router';

import {
  listarAlertasFirebase,
} from '../firebase/produtosFirebase';

function ItemAlerta({ item }: any) {
  const esgotado =
    Number(item.quantidade || 0) === 0;

  const imagemProduto =
    item.imagem
      ? { uri: item.imagem }
      : require('../assets/images/velas.png');

  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <Image
          source={imagemProduto}
          style={styles.img}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>
            {item.nome}
          </Text>

          <View style={styles.row}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.categoria || 'PEÇA'}
              </Text>
            </View>

            <Text style={styles.codigo}>
              {item.codigo}
            </Text>
          </View>

          <Text style={styles.moto}>
            {item.modelo_moto}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text
          style={[
            styles.qtd,
            {
              color: esgotado
                ? '#FF3B3B'
                : '#FFC107',
            },
          ]}
        >
          {item.quantidade} Uni.
        </Text>

        <Text style={styles.min}>
          min: {item.estoque_minimo}
        </Text>
      </View>
    </View>
  );
}

export default function Alertas() {
  const [alertas, setAlertas] =
    useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregarAlertas();
    }, [])
  );

  async function carregarAlertas() {
    const lista =
      await listarAlertasFirebase();

    setAlertas(lista as any[]);
  }

  const esgotados =
    alertas.filter(
      (item: any) =>
        Number(item.quantidade || 0) === 0
    );

  const estoqueBaixo =
    alertas.filter(
      (item: any) =>
        Number(item.quantidade || 0) > 0
    );

  return (
    <View style={styles.container}>
      <Header title="Alertas" showSettings />

      <View style={styles.content}>
        <Text style={styles.titulo}>
          Alerta de Estoque
        </Text>

        <Text style={styles.subtitulo}>
          Peças que precisam de atenção
        </Text>

        {alertas.length === 0 ? (
          <Text style={styles.vazio}>
            Nenhum alerta encontrado
          </Text>
        ) : (
          <FlatList
            data={[
              {
                tipo: 'titulo',
                titulo: `❗ Esgotados (${esgotados.length})`,
                cor: '#ff3b3b',
              },
              ...esgotados,
              {
                tipo: 'titulo',
                titulo: `⚠️ Estoque Baixo (${estoqueBaixo.length})`,
                cor: '#ffc107',
              },
              ...estoqueBaixo,
            ]}
            keyExtractor={(item: any, index) =>
              item.id
                ? item.id.toString()
                : `titulo-${index}`
            }
            renderItem={({ item }: any) => {
              if (item.tipo === 'titulo') {
                return (
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: item.cor },
                    ]}
                  >
                    {item.titulo}
                  </Text>
                );
              }

              return <ItemAlerta item={item} />;
            }}
          />
        )}
      </View>

      <Footer active="alertas" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },

  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },

  titulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 15,
  },

  vazio: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },

  sectionLabel: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 10,
  },

  item: {
    backgroundColor: '#2b2b2b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  img: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#444',
  },

  nome: {
    color: '#fff',
    fontWeight: 'bold',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },

  badge: {
    backgroundColor: '#ff8c00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },

  codigo: {
    color: '#bbb',
    fontSize: 12,
  },

  moto: {
    color: '#999',
    fontSize: 11,
    marginTop: 3,
  },

  right: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  qtd: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  min: {
    color: '#bbb',
    fontSize: 11,
  },
});