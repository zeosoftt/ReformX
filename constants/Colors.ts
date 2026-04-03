/**
 * Tasarım tokenları — sıcak nötr zemin, bitkisel ana renk (wellness / 2024–2025).
 */

const primary = '#3D5A4F';
const primaryMuted = '#5C7A6E';
const accent = '#C4A77D';

export default {
  light: {
    text: '#1A1A1A',
    textSecondary: '#5C5C5C',
    textMuted: '#8E8E93',
    background: '#F5F2ED',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: 'rgba(0,0,0,0.06)',
    tint: primary,
    primary,
    primaryMuted,
    accent,
    tabIconDefault: '#AEAEAE',
    tabIconSelected: primary,
    danger: '#C45C5C',
    overlay: 'rgba(0,0,0,0.45)',
  },
  dark: {
    text: '#F2F2F7',
    textSecondary: '#AEAEB2',
    textMuted: '#8E8E93',
    background: '#0D0F0E',
    surface: '#1C1F1D',
    surfaceElevated: '#242824',
    border: 'rgba(255,255,255,0.08)',
    tint: '#A8C4B8',
    primary: '#7A9B8E',
    primaryMuted: '#5C7A6E',
    accent: '#D4BC94',
    tabIconDefault: '#636366',
    tabIconSelected: '#A8C4B8',
    danger: '#E57373',
    overlay: 'rgba(0,0,0,0.6)',
  },
};

export type ColorSchemeName = 'light' | 'dark';
