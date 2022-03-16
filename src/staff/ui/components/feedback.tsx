import { Alert, AlertColor, AlertProps, Snackbar, SnackbarProps } from "@mui/material";
import { uniqueId } from "lodash";
import { createContext, useContext, useMemo, useRef, useState } from "react";



type IAlert = {
    id: string;
    message: string;
} & AlertProps;

interface IFeedbackContext {
    alerts: IAlert[]
}

const FeedbackGlobalContext = {
    alerts: [],
}

const FeedbackContext = createContext<IFeedbackContext>(FeedbackGlobalContext);

export function Feedback(props: {
    children: any;
} & Parameters<typeof FeedbackDisplay>[0]) {
    const { children, ...restProps } = props;
    const ctx: IFeedbackContext = {
        alerts: []
    }
    provideFeedback(ctx, 'success', {
        message: 'hi'
    })
    provideFeedback(ctx, 'error', {
        message: 'oof'
    })
    return <FeedbackContext.Provider value={ctx}>
        {props.children}
        <FeedbackDisplay {...restProps} />
    </FeedbackContext.Provider>
}

export function FeedbackDisplay(props: {
    alert?: AlertProps
} & SnackbarProps) {
    const [open, setOpen] = useState(false);
    const { alert: alertProps, ...snackbarProps } = props;
    const { alerts } = useContext(FeedbackContext);
    const hasAlert = alerts.length > 0;
    const ref = useRef(null);
    if (hasAlert) ref.current = alerts[0];
    const alert = ref.current;
    if (hasAlert && !open) setOpen(true);
    return <>
        {alert && (
            <Snackbar open={open} {...snackbarProps}>
                <Alert {...alert} {...alertProps} onClose={() => {
                    alerts.splice(alerts.findIndex(o => o.id == alert.id), 1);
                    setOpen(false);
                }}>{alert.id} - {alert.message}</Alert>
            </Snackbar>
        )}
        
    </>
}

export function useFeedback() {
    const ctx = useContext(FeedbackContext);
    return {
        success: provideFeedback.bind(null, ctx, 'success'),
        info: provideFeedback.bind(null, ctx, 'info'),
        warning: provideFeedback.bind(null, ctx, 'warning'),
        error: provideFeedback.bind(null, ctx, 'error')
    }
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export function provideFeedback(context: IFeedbackContext, type: AlertColor, props: PartialBy<IAlert, 'id'>) {
    props.id = uniqueId('alert');
    props.severity = type;
    context.alerts.push(props as IAlert);
}
