import { Text, type TextProps } from 'react-native';

import { typography } from '@/constants/theme';
import { useAppColors } from '@/hooks/useAppColors';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'muted' | 'label';

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
};

export function AppText({ variant = 'body', muted, style, ...rest }: Props) {
  const c = useAppColors();
  const color = muted
    ? c.textMuted
    : variant === 'muted'
      ? c.textSecondary
      : variant === 'label'
        ? c.primary
        : c.text;
  return <Text style={[typography[variant], { color }, style]} {...rest} />;
}
