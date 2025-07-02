import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const checkResponsive = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);

    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    theme,
  };
};

export const responsiveClass = (classes: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default?: string;
}) => {
  return `
    ${classes.default || ''}
    ${classes.mobile ? 'sm:' + classes.mobile : ''}
    ${classes.tablet ? 'md:' + classes.tablet : ''}
    ${classes.desktop ? 'lg:' + classes.desktop : ''}
  `.trim();
};

export const responsiveStyles = (styles: {
  mobile?: Record<string, string | number>;
  tablet?: Record<string, string | number>;
  desktop?: Record<string, string | number>;
  default?: Record<string, string | number>;
}) => {
  const css = [];

  if (styles.default) {
    css.push(Object.entries(styles.default)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' '));
  }

  if (styles.mobile) {
    css.push(`@media (max-width: 767px) { ${Object.entries(styles.mobile)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')} }`);
  }

  if (styles.tablet) {
    css.push(`@media (min-width: 768px) and (max-width: 1023px) { ${Object.entries(styles.tablet)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')} }`);
  }

  if (styles.desktop) {
    css.push(`@media (min-width: 1024px) { ${Object.entries(styles.desktop)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ')} }`);
  }

  return css.join(' ');
};
