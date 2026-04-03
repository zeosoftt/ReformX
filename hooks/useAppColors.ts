import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export function useAppColors() {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}
