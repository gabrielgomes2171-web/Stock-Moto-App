import  React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export default function Cadastrese(){
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarVisivel, setConfirmarVisivel] = useState(false);

    return(
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>CRIAR CONTA</Text>

                <Text style={styles.subtitle}>
                Bem vindo ao STOCKMOTO!
                </Text>
                <Text style={styles.subtitle}>
                    Preencha seus dados para começar
                </Text>

                <View style={styles.inputContainer}>
                    <Ionicons name='person-outline' size={18} color='#0D0D0D' />
                    <TextInput
                        placeholder='Nome Completo'
                        placeholderTextColor='#999'
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name='mail-outline' size={20} color='#0D0D0D' />
                    <TextInput
                        placeholder='Seu E-mail'
                        placeholderTextColor='#999'
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name='lock-closed-outline' size={20} color='#0D0D0D' />
                    <TextInput
                        placeholder='Nova Senha'
                        placeholderTextColor='#999'
                        secureTextEntry={!senhaVisivel}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                        <Ionicons
                            name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color='#0D0D0D'
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name='lock-open-outline' size={18} color='#0D0D0D' />
                    <TextInput
                        placeholder='Confirmar Senha'
                        placeholderTextColor='#999'
                        secureTextEntry={!confirmarVisivel}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setConfirmarVisivel(!confirmarVisivel)}>
                        <Ionicons
                            name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color='#0D0D0D'
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.terms}>
                    Li e Aceito os{''}
                    <Text style={styles.link}>Termos de Uso</Text>
                </Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>CADASTRE-SE</Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.login}>Voltar para o Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "900%",
    maxWidth: 360,
  },

  title: {
    color: "#FFF",
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 1,
  },

  subtitle: {
    color: "#AAA",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginTop: 14,
  },

  input: {
    flex: 1,
    color: "#0D0D0D",
    fontSize: 13,
    marginLeft: 10,
  },

  terms: {
    color: "#9CA3AF",
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
  },

  link: {
    color: "#FF7A00",
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#FF7A00",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  login: {
    color: "#38BDF8",
    fontSize: 12,
    textAlign: "center",
    marginTop: 14,
  },
});
