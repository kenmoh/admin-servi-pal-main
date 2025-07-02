import { createTheme } from 'next-themes';

export const theme = createTheme({
  themes: [
    {
      name: 'light',
      colors: {
        primary: '#FF7E00',
        secondary: '#FFA500',
        background: '#FFFFFF',
        foreground: '#1A1A1A',
        card: '#FFFFFF',
        border: '#E5E7EB',
        input: '#F9FAFB',
        ring: '#FF7E00',
        selection: '#FF7E00',
      },
    },
    {
      name: 'dark',
      colors: {
        primary: '#FF7E00',
        secondary: '#FFA500',
        background: '#1A1A1A',
        foreground: '#FFFFFF',
        card: '#1F1F1F',
        border: '#374151',
        input: '#2D3748',
        ring: '#FF7E00',
        selection: '#FF7E00',
      },
    },
  ],
});

export const themeConfig = {
  colors: {
    orange: {
      50: '#FFF7ED',
      100: '#FDF4E6',
      200: '#FBE0C9',
      300: '#FAC1A6',
      400: '#FAA588',
      500: '#FF7E00',
      600: '#D46B00',
      700: '#B35A00',
      800: '#924B00',
      900: '#713C00',
      950: '#5A2E00',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#0C121B',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
