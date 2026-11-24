import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

/*
  Escolhe uma foto da galeria, diminui o tamanho dela e devolve
  um texto "data:image/jpeg;base64,..." que pode ser salvo direto no Firestore.

  Por que não salvar o "uri" que o ImagePicker devolve?
  Porque ele é um arquivo temporário do celular (file:///...cache...).
  O sistema apaga esse arquivo depois de um tempo e ele não existe em
  outros aparelhos, então a foto "some" da tela de estoque.

  Guardando a imagem dentro do próprio documento, ela aparece sempre,
  em qualquer celular. A foto é reduzida para no máximo 600px porque o
  Firestore aceita no máximo 1 MB por documento.
*/

const LARGURA_MAXIMA = 600;
const TAMANHO_MAXIMO = 700_000; // caracteres (~500 KB), bem abaixo do limite de 1 MB

export async function escolherImagemBase64(): Promise<string | null> {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissao.granted) {
    Alert.alert(
      "Permissão necessária",
      "Permita acesso à galeria para escolher uma imagem"
    );
    return null;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
  });

  if (resultado.canceled) {
    return null;
  }

  const foto = resultado.assets[0];

  try {
    const contexto = ImageManipulator.manipulate(foto.uri);

    // Só diminui se a foto for maior que 600px de largura
    if ((foto.width || 0) > LARGURA_MAXIMA) {
      contexto.resize({ width: LARGURA_MAXIMA });
    }

    const imagem = await contexto.renderAsync();
    const salva = await imagem.saveAsync({
      compress: 0.6,
      format: SaveFormat.JPEG,
      base64: true,
    });

    if (!salva.base64) {
      throw new Error("Imagem sem base64");
    }

    const dataUri = `data:image/jpeg;base64,${salva.base64}`;

    if (dataUri.length > TAMANHO_MAXIMO) {
      Alert.alert(
        "Imagem muito grande",
        "Escolha outra foto ou recorte uma área menor."
      );
      return null;
    }

    return dataUri;
  } catch (error) {
    console.log("Erro ao preparar imagem:", error);
    Alert.alert("Erro", "Não foi possível usar essa imagem. Tente outra.");
    return null;
  }
}
