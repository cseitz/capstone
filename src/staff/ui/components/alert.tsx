import { Alert, AlertProps, Box, Collapse, Slide, Snackbar, Stack } from "@mui/material";
import { createRenderAuthority, RenderAuthority, useRenderAuthority } from "lib/hooks";
import { uniqueId } from "lodash";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";


type AlertType = AlertProps['color'];
type IAlert = {
    id?: string;
    type?: AlertType;
    message: string;
    context?: IAlertContext;
    stage?: number;
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
    return bindCreateAlert({ context });
}

export function createAlert(...args: Partial<AlertOrMessage>[]) {
    const details = ConstructAlert(...args)
    if (!details.context) details.context = AlertGlobalContext;
    console.log('alert', details);
    details.context.alerts.push(details);
    details.context.renderAuthority.render();
    return true;
}

createAlert.success = createAlert.bind(null, { type: 'success' });
createAlert.info = createAlert.bind(null, { type: 'info' });
createAlert.warning = createAlert.bind(null, { type: 'warning' });
createAlert.error = createAlert.bind(null, { type: 'error' });

function bindCreateAlert(base: Partial<IAlert>) {
    const bound = createAlert.bind(null, base);
    bound.success = (bound?.success || createAlert.success).bind(null, base);
    bound.info = (bound?.info || createAlert.info).bind(null, base);
    bound.warning = (bound?.warning || createAlert.warning).bind(null, base);
    bound.error = (bound?.error || createAlert.error).bind(null, base);
    return bound as typeof createAlert;
}


export function AlertProvider(props: Partial<IAlert> & { children: any }) {
    const { children, ...base } = props;
    const renderAuthority = useRef(createRenderAuthority()).current;
    const alerts = useRef([]).current;
    const ctx: IAlertContext = {
        base,
        alerts,
        renderAuthority,
    };
    return <AlertContext.Provider value={ctx}>
        {children}
        <AlertDisplay />
    </AlertContext.Provider>
}

function AlertDisplay() {
    const context = useContext(AlertContext);
    useRenderAuthority(context);

    context.alerts = context.alerts.filter(o => !o.stage || o.stage <= 4);
    const { alerts } = context;
    return <Box sx={{ position: 'fixed', bottom: '20px' }}>
        <Stack>
            {alerts.slice(0, 3).reverse().map((alert, index) => (
                <AlertItemDisplay alert={alert} key={alert.id} index={index} />
            ))}
        </Stack>
    </Box>
}

function AlertItemDisplay(props: { alert: IAlert, index: number }) {
    const { alert } = props;
    const { message, id, context, type, ...alertProps } = alert;
    const [stage, setStage] = useState(1);
    // return <Snackbar open sx={{
    //     transition: 'margin-bottom 0.5s',
    //     mb: props.index * 10,
    // }}>

    // </Snackbar>
    useEffect(() => {
        if (stage > 4) return;
        let delay;
        switch (stage) {
            case 1: delay = 6000; break;
            case 2: delay = 1000; break;
            case 3: delay = 1000; break;
            case 4: delay = 1000; break;
        }
        const timeout = setTimeout(() => setStage(stage + 1), delay)
        return () => clearTimeout(timeout);
    }, [stage]);
    if (alert.stage != stage) alert.stage = stage;
    return <>
        <Box>
            <Slide direction="right" in={true || stage <= 2}>
                <Collapse in={stage <= 1}>

                    <Alert {...alertProps} color={type}>
                        {message}
                    </Alert>
                </Collapse>
            </Slide>
        </Box>
    </>
}
