import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { layout, spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useAppColors } from '@/hooks/useAppColors';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  contentStyle?: ViewStyle;
  /** false → FlatList gibi kendi padding’ini yöneten ekranlar için */
  padded?: boolean;
};

export function Screen({ children, scroll, edges, contentStyle, padded = true }: Props) {
  const c = useAppColors();
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const constrain = Platform.OS === 'web' || width > layout.maxContentWidth;
  const maxWidth = Math.min(width, layout.maxContentWidth);

  const padStyle = padded
    ? {
        paddingHorizontal: layout.screenPaddingHorizontal,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xxxl,
      }
    : undefined;

  const frameStyle = constrain
    ? ({ alignSelf: 'center' as const, width: '100%' as const, maxWidth })
    : undefined;

  const inner = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[frameStyle, padStyle, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, frameStyle, padStyle, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: c.background }]} edges={edges ?? ['top']}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {inner}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
