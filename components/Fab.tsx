import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { layout, radius, spacing } from '@/constants/theme';
import { useAppColors } from '@/hooks/useAppColors';

type Props = {
  onPress: () => void;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
};

export function Fab({ onPress, icon = 'plus' }: Props) {
  const c = useAppColors();
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: c.primary,
            opacity: pressed ? 0.9 : 1,
            shadowColor: c.text,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Yeni ekle">
        <FontAwesome name={icon} size={22} color={c.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: spacing.xl,
    bottom: Platform.OS === 'web' ? spacing.xxl : spacing.xl,
    maxWidth: layout.maxContentWidth,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
});
