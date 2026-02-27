import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Rajdhani', 'Barlow Condensed', 'Segoe UI', sans-serif",
    body: "'IBM Plex Sans', 'Inter', 'Segoe UI', sans-serif",
  },
  colors: {
    baseball: {
      navy: "#0c2340",
      red: "#ba0c2f",
      field: "#2f6b3f",
      clay: "#b86a3e",
      cream: "#f6f1e7",
    },
    brand: {
      50: "#eef5ff",
      100: "#d4e5ff",
      200: "#abcaff",
      300: "#7daeff",
      400: "#4d8fff",
      500: "#236ee8",
      600: "#1654b6",
      700: "#103d84",
      800: "#0a2857",
      900: "#071936",
    },
    accent: {
      50: "#fff2f3",
      100: "#ffd9de",
      200: "#ffb2be",
      300: "#ff8599",
      400: "#ff5575",
      500: "#e63156",
      600: "#bf1f42",
      700: "#8f1530",
      800: "#630b1f",
      900: "#3b0412",
    },
  },
  semanticTokens: {
    colors: {
      pageBg: {
        default: "#f5f1e8",
        _dark: "#08111d",
      },
      pageGradientStart: {
        default: "#f8f1e5",
        _dark: "#0b1628",
      },
      pageGradientEnd: {
        default: "#ebf2e8",
        _dark: "#0d1f19",
      },
      panelBg: {
        default: "#fffdf8",
        _dark: "#0e1828",
      },
      panelMuted: {
        default: "#eee5d8",
        _dark: "#172335",
      },
      panelSubtle: {
        default: "#f8f3e9",
        _dark: "#121f31",
      },
      borderSubtle: {
        default: "#dbcdb7",
        _dark: "#23354f",
      },
      borderStrong: {
        default: "#c4af8f",
        _dark: "#35517b",
      },
      textPrimary: {
        default: "#16273e",
        _dark: "#edf2ff",
      },
      textSecondary: {
        default: "#3b4d64",
        _dark: "#9cb0ce",
      },
      textMuted: {
        default: "#6b6f79",
        _dark: "#7f96b8",
      },
      navBg: {
        default: "rgba(248, 243, 234, 0.94)",
        _dark: "rgba(8, 14, 25, 0.92)",
      },
      footerBg: {
        default: "#ebe2d3",
        _dark: "#0c1522",
      },
      heroOverlay: {
        default: "rgba(244, 249, 255, 0.82)",
        _dark: "rgba(5, 10, 19, 0.82)",
      },
      statGood: {
        default: "#1e8f5f",
        _dark: "#32c27f",
      },
      statWarn: {
        default: "#a06b12",
        _dark: "#efb83f",
      },
      statBad: {
        default: "#b0324a",
        _dark: "#ff5f7d",
      },
      focusRing: {
        default: "#1f6de0",
        _dark: "#5fa3ff",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "pageBg",
        color: "textPrimary",
        minH: "100vh",
      },
      "#root": {
        minH: "100vh",
      },
      "*::selection": {
        bg: "accent.500",
        color: "white",
      },
    },
  },
  radii: {
    panel: "20px",
  },
  shadows: {
    glow: "0 0 0 2px rgba(95,163,255,0.32), 0 10px 30px rgba(8,25,51,0.35)",
    panel: "0 10px 30px rgba(7, 24, 51, 0.18)",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: 700,
        letterSpacing: "0.01em",
        _focusVisible: {
          boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)",
        },
      },
      variants: {
        cta: {
          bg: "accent.500",
          color: "white",
          _hover: {
            bg: "accent.400",
            transform: "translateY(-1px)",
            boxShadow: "panel",
          },
          _active: {
            bg: "accent.600",
          },
        },
        ghostPanel: {
          bg: "panelMuted",
          color: "textPrimary",
          _hover: {
            bg: "panelSubtle",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "panelBg",
          color: "textPrimary",
          borderRadius: "panel",
          borderWidth: "1px",
          borderColor: "borderSubtle",
          boxShadow: "panel",
        },
      },
    },
    Tabs: {
      variants: {
        line: {
          tab: {
            color: "textSecondary",
            fontWeight: 700,
            _selected: {
              color: "textPrimary",
              borderColor: "accent.500",
            },
            _focusVisible: {
              boxShadow: "0 0 0 3px var(--chakra-colors-focusRing)",
            },
          },
          tablist: {
            borderColor: "borderSubtle",
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: "panelSubtle",
            borderWidth: "1px",
            borderColor: "borderSubtle",
            _hover: {
              borderColor: "borderStrong",
            },
            _focusVisible: {
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
            },
          },
        },
      },
      defaultProps: {
        variant: "filled",
      },
    },
    Select: {
      variants: {
        filled: {
          field: {
            bg: "panelSubtle",
            borderWidth: "1px",
            borderColor: "borderSubtle",
            _hover: {
              borderColor: "borderStrong",
            },
            _focusVisible: {
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
            },
          },
        },
      },
      defaultProps: {
        variant: "filled",
      },
    },
  },
});

export default theme;
