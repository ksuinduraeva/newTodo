import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#044941",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#4db6ac",
            contrastText: "#ffffff",
        },
        error: { main: "#d32f2f" },
        warning: { main: "#ac08a9" },
        info: { main: "#0288d1" },
        success: { main: "#2e7d32" },
        background: {
            default: "#ffffff",
            paper: "#e7f6f4",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
        htmlFontSize: 16,
        h1: { fontSize: "2rem", fontWeight: 700 },
        h2: { fontSize: "1.5rem", fontWeight: 600 },
        body1: { fontSize: "1rem" },
        button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { padding: "8px 16px", borderRadius: 10 },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { boxShadow: "none" },
            },
        },
    },
});

export default theme;
