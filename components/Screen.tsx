import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { useAppColors } from '@/hooks/useAppColors';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  contentStyle?: ViewStyle;
};

export function Screen({ children, scroll, edges, contentStyle }: Props) {
  const c = useAppColors();
  const scheme = useColorScheme();
  const inner = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
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
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
