import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function VerificarEmail() {

  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      const finalCode = code.join('');
      console.log('Código:', finalCode);

      alert('Código completo: ' + finalCode);
    }
  }, [code]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;

    setTimer(60);
    alert('Código reenviado!');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>VERIFIQUE SEU</Text>
      <Text style={styles.title}>E-MAIL</Text>

      <Text style={styles.subtitle}>Enviamos um código de 4 dígitos para seuemail@exemplo.com.</Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputs[index]}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/redefinir-senha')}
      >
        <Text style={styles.buttonText}>VERIFICAR CÓDIGO</Text>
      </TouchableOpacity>

      <Text style={styles.resend}>
        Não recebeu o código?{" "}
        <Text
          style={[
            styles.resendHighlight,
            timer > 0 && { opacity: 0.5 }
          ]}
          onPress={handleResend}
        >
          {timer > 0 ? `REENVIAR (${timer}s)` : 'REENVIAR'}
        </Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    color: '#FFF',
    fontSize: 35,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  subtitle: {
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    fontSize: 15,
  },

  codeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 50,
  },

  input: {
    width: 55,
    height: 65,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  button: {
    width: '100%',
    backgroundColor: '#F28C28',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },

  resend: {
    color: '#A1A1AA',
    fontSize: 12,
  },

  resendHighlight: {
    color: '#F28C28',
    fontWeight: 'bold',
  },
});