import { createTheme, CssBaseline, useMediaQuery, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProps } from "next/app";
import { useMemo } from "react";
import { AlertProvider } from "ui/components/alert";
import { NavBar } from "../ui/components/navbar";

import '../ui/styles/global.scss';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    const prefersDarkMode = false; //useMediaQuery(`(prefers-color-scheme: dark)`);
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
                background: {
                    default: prefersDarkMode ? '#35363a' : 'white',
                }
            },
            components: {
                MuiPagination: {
                    styleOverrides: {
                        ul: {
                            justifyContent: 'center'
                        }
                    }
                }
            }
        })
    }, [prefersDarkMode]);
    return <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
            <NavBar />
            <AlertProvider>
                <Component {...pageProps} />
            </AlertProvider>
        </QueryClientProvider>
    </ThemeProvider>
}