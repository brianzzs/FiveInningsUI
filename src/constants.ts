export const ROUTES = {
    HOME: '/',
    STATISTICS: '/stats',
    PLAYERS: '/players'
} as const;
  
export const THEME = {
    colors: {
      primary: '#1a365d',
      primaryHover: '#2a4365',
      background: '#0a0c10',
      navBackground: '#1a202c',
      accent: '#e31837',
      success: '#38a169',
      warning: '#d69e2e',
      danger: '#e53e3e',
      cardBg: '#1a202c',
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        light: '#94a3b8'
      }
    },
    fonts: {
      heading: '"Montserrat", sans-serif',
      body: `'Inter', sans-serif`,
    },
    shadows: {
      card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      hover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    }
} as const;