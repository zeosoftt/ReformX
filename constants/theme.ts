/**
 * Layout, tipografi ve marka fontları — web, iOS, Android.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const layout = {
  maxContentWidth: 720,
  screenPaddingHorizontal: 20,
  fabClearance: 96,
  tabBarHeight: 60,
} as const;

/** DM Sans — _layout.tsx içinde yüklenir */
export const fonts = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
} as const;

export const typography = {
  display: {
    fontSize: 32,
    fontFamily: fonts.bold,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.bold,
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: fonts.semibold,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.regular,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontFamily: fonts.medium,
    lineHeight: 18,
  },
  muted: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 21,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.semibold,
    letterSpacing: 0.6,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
  },
} as const;

export const shadows = {
  card: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  fab: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
