import { createTheme, CssBaseline, useMediaQuery, ThemeProvider } from "@mui/material";
import { useUser } from "lib/auth/client";
import { AppProps } from "next/app";
import { useCallback, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { clearInterval } from "timers";
import { AlertProvider } from "ui/components/alert";
import { NavBar } from "../ui/components/navbar";
import '../ui/styles/global.scss';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    const prefersDarkMode = useMediaQuery(`(prefers-color-scheme: dark)`);
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
                background: {
                    default: prefersDarkMode ? '#35363a' : 'white',
                },
                primary: {
                    main: '#1976d2'
                }
            },
            components: {
                MuiPagination: {
                    styleOverrides: {
                        ul: {
                            justifyContent: 'center'
                        }
                    }
                },
                MuiTextField: {
                    defaultProps: {
                        InputLabelProps: {
                            shrink: true
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
            <UserSessionUpdater />
            <AlertProvider>
                <Component {...pageProps} />
            </AlertProvider>
        </QueryClientProvider>
    </ThemeProvider>
}

function UserSessionUpdater() {
    // const user = useUser();
    const refetch = useCallback(() => {
        fetch('/api/users/me').then(res => res.json())
    }, []);
    useEffect(() => {
        refetch();
        const intv = setInterval(refetch, 2000);
        window?.addEventListener('focus', refetch);
        return () => {
            clearInterval(intv);
            window?.removeEventListener('focus', refetch);
        }
    }, [])
    return <span />;
}