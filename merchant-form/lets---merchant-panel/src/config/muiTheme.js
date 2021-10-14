import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ed3c60",
      light: "#f0637f",
      dark: "#a52a43",
      // dark: "#aa2f37",
    },
    secondary: {
      main: "#4BA4FF",
      light: "#6fb6ff",
      dark: "#3472b2",
      contrastText: "#fff",
    },
  },
  overrides: {
    MuiPaper: {
      rounded: {
        borderRadius: 16,
        padding: 16,
      },
    },
    MuiButton: {
      root: {
        borderRadius: 999,
        padding: "8px 16px",
      },
      outlined: {
        backgroundColor: "#f4f4f8",
        color: "#adb9c2",
        padding: "8px 16px",
      },
    },
  },
});

export default theme;
