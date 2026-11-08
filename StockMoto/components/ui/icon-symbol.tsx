
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import {
  OpaqueColorValue,
  type StyleProp,
  type TextStyle,
} from 'react-native';

// Mapeamento dos SF Symbols para Material Icons
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} satisfies Record<string, ComponentProps<typeof MaterialIcons>['name']>;

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue | number | null;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  const iconColor =
    typeof color === 'number' ? '#000000' : color ?? '#000000';

  return (
    <MaterialIcons
      color={iconColor}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
