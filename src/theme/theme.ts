import { extendTheme, Stat } from "@chakra-ui/react";

export const theme = extendTheme({
  components: {
    Button: {
      variants: {
        header: {
          bg: "transparent",
          color: "white",
          borderRadius: 0,
          py: 10,
          _hover: { bg: "gray.500" },
        },
      },
    },
    Stat: {
      variants: {
        info: {
          bg: "blue.200",
          p: 4,
          borderRadius: "md",
        },
      },
    },
  },
});
