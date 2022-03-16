import { Alert, AlertColor, AlertProps, Snackbar, SnackbarProps } from "@mui/material";
import { createRenderAuthority, RenderAuthority, useRenderAuthority } from "lib/hooks";
import { uniqueId } from "lodash";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";



type IAlert = {
    id: string;
    message: string;
} & AlertProps;

interface IFeedbackContext {
    alerts: IAlert[]
    authority: RenderAuthority;
}

const FeedbackGlobalContext = {
    alerts: [],
    authority: createRenderAuthority(),
}

const FeedbackContext = createContext<IFeedbackContext>(FeedbackGlobalContext);

export function Feedback(props: {
    children: any;
} & Parameters<typeof FeedbackDisplay>[0]) {
    const { children, ...restProps } = props;
    const ctx: IFeedbackContext = useMemo(() => ({
        alerts: [],
        authority: createRenderAuthority()
    }), []);
    // provideFeedback(ctx, 'success', {
    //     message: 'hi'
    // })
    // provideFeedback(ctx, 'error', {
    //     message: 'oof'
    // })
    useEffect(() => {

    }, [])
    return <FeedbackContext.Provider value={ctx}>
        {props.children}
        <FeedbackDisplay {...restProps} />
    </FeedbackContext.Provider>
}

export function FeedbackDisplay(props: {
    alert?: AlertProps
} & SnackbarProps) {
    const [debounce, setDebounce] = useState(false);
    const [open, setOpen] = useState(false);
    const { alert: alertProps, ...snackbarProps } = props;
    const { alerts, authority } = useContext(FeedbackContext);
    useRenderAuthority(authority);
    const hasAlert = alerts.length > 0;
    const ref = useRef(null);
    if (hasAlert && !debounce) ref.current = alerts[0];
    const alert = ref.current;
    if (hasAlert && !open && !debounce) setOpen(true);
    const onClose = function(event, reason) {
        if (reason == 'clickaway') return;
        alerts.splice(alerts.findIndex(o => o.id == alert.id), 1);
        setDebounce(true);
        setOpen(false);
    };
    useEffect(() => {
        if (debounce) {
            const timeout = setTimeout(() => {
                setDebounce(false);
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [debounce])

    return <>
        {alert && (
            <Snackbar open={open && !debounce} {...snackbarProps} onClose={onClose}>
                <Alert {...alert} {...alertProps} onClose={onClose}>{alert.message}</Alert>
            </Snackbar>
        )}
        
    </>
}

export function useFeedback() {
    const ctx = useContext(FeedbackContext);
    type pF = (props: Parameters<typeof provideFeedback>[2]) => void;
    return {
        success: provideFeedback.bind(null, ctx, 'success') as pF,
        info: provideFeedback.bind(null, ctx, 'info') as pF,
        warning: provideFeedback.bind(null, ctx, 'warning') as pF,
        error: provideFeedback.bind(null, ctx, 'error') as pF
    }
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export function provideFeedback(context: IFeedbackContext, type: AlertColor, props: PartialBy<IAlert, 'id'>) {
    props.id = uniqueId('alert');
    props.severity = type;
    context.alerts.push(props as IAlert);
    context.authority.render();
}
