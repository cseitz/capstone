import { Alert, AlertProps, Box, Collapse, Slide, Snackbar, Stack } from "@mui/material";
import { createRenderAuthority, mergeProps, RenderAuthority, useRenderAuthority } from "lib/hooks";
import { uniqueId } from "lodash";
import { createContext, MutableRefObject, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";


type AlertType = AlertProps['color'];
type IAlert = {
    id?: string;
    type?: AlertType;
    message: string;
    duration?: number;
    context?: IAlertContext;
    stage?: number;
    height?: number;
    offset?: number;
    ref?: MutableRefObject<HTMLDivElement>;
    __proto__?: Partial<IAlert>;
} & AlertProps;
type AlertOrMessage = Partial<IAlert> | string;

interface IAlertContext {
    alerts: IAlert[]
    renderAuthority: RenderAuthority;
    base?: Partial<IAlert>;
}

const AlertGlobalContext = {
    alerts: [],
    renderAuthority: createRenderAuthority(),
}

const AlertContext = createContext<IAlertContext>(AlertGlobalContext);

function ConstructAlert(details?: AlertOrMessage, ...extra: AlertOrMessage[]): IAlert {
    if (typeof details == 'string')
        details = { message: details };
    extra = extra.map(o => typeof o == 'string' ? { message: o } : o);
    let combined = {};
    while (extra.length > 0) {
        Object.assign(combined, extra.pop())
    }
    Object.assign(combined, details);
    details = combined;
    if (!details.id)
        details.id = uniqueId('alert');
    if (this)
        details.__proto__ = details;
    if (details?.context)
        details = { ...(details.context?.base || {}), ...details };
    return details as IAlert;
}


export function useAlert(base?: Partial<IAlert>) {
    const context = useContext(AlertContext);
    if (base) return bindCreateAlert({ context, ...base });
    return bindCreateAlert({ context }) as typeof createAlert;
}

export function createAlert(...args: Partial<AlertOrMessage>[]) {
    const details = ConstructAlert(...args)
    if (!details.context) details.context = AlertGlobalContext;
    console.log('alert', details);
    details.context.alerts.push(details);
    details.context.renderAuthority.render();
    return true;
}

createAlert.success = createAlert.bind(null, { type: 'success' }) as typeof createAlert;
createAlert.info = createAlert.bind(null, { type: 'info' }) as typeof createAlert;
createAlert.warning = createAlert.bind(null, { type: 'warning' }) as typeof createAlert;
createAlert.error = createAlert.bind(null, { type: 'error' }) as typeof createAlert;

function bindCreateAlert(base: Partial<IAlert>) {
    const bound = createAlert.bind(null, base);
    bound.success = (bound?.success || createAlert.success).bind(null, base) as typeof createAlert;
    bound.info = (bound?.info || createAlert.info).bind(null, base) as typeof createAlert;
    bound.warning = (bound?.warning || createAlert.warning).bind(null, base) as typeof createAlert;
    bound.error = (bound?.error || createAlert.error).bind(null, base) as typeof createAlert;
    return bound as typeof createAlert;
}


export function AlertProvider(props: Partial<IAlert> & { children: any }) {
    const { children, ...base } = props;
    const renderAuthority = useRef(createRenderAuthority()).current;
    const alerts = useRef([]).current;
    const ctx: IAlertContext = useMemo(() => ({
        base,
        alerts,
        renderAuthority,
    }), []);
    return <AlertContext.Provider value={ctx}>
        {children}
        <AlertDisplay />
    </AlertContext.Provider>
}

function AlertDisplay() {
    const context = useContext(AlertContext);
    useRenderAuthority(context.renderAuthority);

    context.alerts = context.alerts.filter(o => !o.stage || o.stage < 4);
    const { alerts } = context;
    return <>
        {alerts.slice(0, 3).map((alert, index) => (
            <AlertItemDisplay alert={alert} key={alert.id} />
        ))}
    </>;
}

function AlertItemDisplay(props: { alert: IAlert }) {
    const { alert } = props;
    const { message, id, context, type, ...alertProps } = alert;
    const { alerts, renderAuthority } = context;
    const ref = useRef<HTMLDivElement>(null);
    useRenderAuthority(renderAuthority);
    useEffect(() => {
        alert.ref = ref;
    }, [ref]);
    const previousAlertIndex = alerts.findIndex(o => o.id == id) - 1;
    const previousAlert = previousAlertIndex >= 0 ? alerts[previousAlertIndex] : null;
    const [stage, setStage] = useState(alert?.stage || 0);
    useLayoutEffect(() => {
        if (stage == 0) {
            alert.height = ref.current.offsetHeight + 10;
            setStage(1);
        }
        alert.offset = previousAlert ? previousAlert.offset + previousAlert.height + 0 : 0;
        // console.log(alert.id, alert.offset);
    }, [previousAlert?.height, previousAlert?.offset]);
    useEffect(() => {
        alert.stage = stage;
        // console.log('do render');
        if (stage >= 3) {
            alert.height = 0;
            const tmt = setTimeout(() => {
                ++alert.stage;
                renderAuthority.render();
            }, 100);
            renderAuthority.render();
            return () => clearTimeout(tmt);
        }
        renderAuthority.render();
    }, [stage]);
    alert.offset = previousAlert ? previousAlert.offset + previousAlert.height + 0 : 0;

    const onClose = function (event, reason?) {
        if (reason == 'clickaway') return;
        setStage(3);
    }


    return <Snackbar {...{
        ref,
        open: stage <= 2,
        onClose,
        autoHideDuration: alert?.duration || 6000,
        sx: {
            mb: alert.offset + 'px',
            transition: stage >= 1 ? 'margin-bottom 0.25s' : undefined,
        }
    }}>
        <Alert {...mergeProps(alertProps, {
            onClose,
            color: type
        })}>
            {message}
        </Alert>
    </Snackbar>
}

