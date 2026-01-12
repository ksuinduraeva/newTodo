import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "react-redux";
import { store } from "./shared/providers/store/index.ts";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./shared/theme/theme";

const root = createRoot(document.getElementById('root')!)
root.render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                    <App />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
);
