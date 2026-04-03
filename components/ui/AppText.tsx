import { Text, type TextProps } from 'react-native';

import { useAppColors } from '@/hooks/useAppColors';

type Variant = 'title' | 'subtitle' | 'body' | 'caption' | 'muted';

const stylesFor = (v: Variant) => {
  switch (v) {
    case 'title':
      return { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 };
    case 'subtitle':
      return { fontSize: 17, fontWeight: '600' as const };
    case 'body':
      return { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 };
    case 'caption':
      return { fontSize: 13, fontWeight: '500' as const };
    case 'muted':
      return { fontSize: 14, fontWeight: '400' as const };
    default:
      return { fontSize: 16 };
  }
};

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
};

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  const c = useAppColors();
  const color = muted ? c.textMuted : variant === 'muted' ? c.textSecondary : c.text;
  return <Text style={[stylesFor(variant), { color }, style]} {...rest} />;
}
