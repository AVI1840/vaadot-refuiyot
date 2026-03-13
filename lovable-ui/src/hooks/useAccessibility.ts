import { useState, useEffect } from 'react';

export type FontSize = 'normal' | 'large' | 'xlarge';

export function useAccessibility() {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('btl-font-size') as FontSize) || 'normal';
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('btl-high-contrast') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('btl-font-size', fontSize);
    document.body.className = document.body.className
      .replace(/font-size-\w+/g, '')
      .trim();
    document.body.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('btl-high-contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  const fontSizeLabel = fontSize === 'normal' ? 'רגיל' : fontSize === 'large' ? 'גדול' : 'גדול מאוד';

  return { fontSize, fontSizeLabel, cycleFontSize, highContrast, setHighContrast };
}
