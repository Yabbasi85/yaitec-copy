import { extendTheme } from "@chakra-ui/react";

// Cores para diferentes brands
const brandColors = {
  default: {
    darkBlue: "#082a46",
    purple: "#5541ff",
    electricGreen: "#00ff89",
    white: "#FFFFFF",
    background: "#F4F4F5",
    text: "#111111",
  },
  brand1: {
    darkBlue: "#082a46",
    purple: "#5541ff",
    electricGreen: "#00ff89",
    white: "#FFFFFF",
    text: "#202020",
    background: "#F4F4F5", // Base mais neutra
  },
};

// Função para criar o tema baseado nas cores da brand selecionada
const createTheme = (brand: keyof typeof brandColors) =>
  extendTheme({
    colors: {
      brand: {
        darkBlue: brandColors[brand].darkBlue,
        purple: brandColors[brand].purple,
        electricGreen: brandColors[brand].electricGreen,
        white: brandColors[brand].white,
        background: brandColors[brand].background,
        text: brandColors[brand].text,
      },
    },
    styles: {
      global: {
        body: {
          backgroundColor: brandColors[brand].background,
          color: brandColors[brand].text,
          fontFamily: "'Futura PT', sans-serif",
        },
        a: {
          color: brandColors[brand].purple,
          _hover: {
            color: brandColors[brand].electricGreen,
          },
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          fontWeight: "medium",
          borderRadius: "8px",
          transition: "background 0.3s ease",
        },
        variants: {
          solid: {
            bg: brandColors[brand].purple,
            color: brandColors[brand].white,
            _hover: {
              bg: brandColors[brand].darkBlue,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            },
          },
          outline: {
            borderColor: brandColors[brand].purple,
            color: brandColors[brand].purple,
            _hover: {
              bg: brandColors[brand].electricGreen,
              color: brandColors[brand].white,
              borderColor: brandColors[brand].electricGreen,
            },
          },
        },
      },
      Input: {
        baseStyle: {
          field: {
            border: `1px solid ${brandColors[brand].purple}`,
            _hover: {
              borderColor: brandColors[brand].electricGreen,
            },
            _focus: {
              borderColor: brandColors[brand].electricGreen,
              boxShadow: "0 0 0 1px #00ff89",
              transition: "all 0.3s ease-in-out",
            },
            h: "48px",
            borderRadius: "8px",
          },
        },
      },
      Textarea: {
        baseStyle: {
          border: `1px solid ${brandColors[brand].purple}`,
          _hover: {
            borderColor: brandColors[brand].electricGreen,
          },
          _focus: {
            borderColor: brandColors[brand].electricGreen,
            boxShadow: "0 0 0 1px #00ff89",
            transition: "all 0.3s ease-in-out",
          },
          borderRadius: "8px",
        },
      },
      Select: {
        baseStyle: {
          field: {
            border: `1px solid ${brandColors[brand].purple}`,
            _hover: {
              borderColor: brandColors[brand].electricGreen,
            },
            _focus: {
              borderColor: brandColors[brand].electricGreen,
              boxShadow: "0 0 0 1px #00ff89",
              transition: "all 0.3s ease-in-out",
            },
            borderRadius: "8px",
          },
        },
      },
      Heading: {
        baseStyle: {
          color: brandColors[brand].darkBlue,
          fontWeight: "bold",
          lineHeight: "1.3",
          letterSpacing: "0.02em",
        },
      },
    },
    shadows: {
      outline: `0 0 0 3px ${brandColors[brand].electricGreen}`,
    },
    fonts: {
      heading: "'Futura PT', sans-serif",
      body: "'Futura PT', sans-serif",
    },
  });

export default createTheme;
