import { Alert, AlertProps, Box } from "@mui/material";
import { createRenderAuthority, RenderAuthority, useRenderAuthority } from "lib/hooks";
import { uniqueId } from "lodash";
import { createContext, useContext, useMemo, useRef } from "react";


type AlertType = AlertProps['color'];
type IAlert = {
    id?: string;
    type?: AlertType;
    message: string;
    context?: IAlertContext;
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
    details.color = details.type;
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

    const { alerts } = context;
    return <Box>
        {alerts.slice(-3).map(alert => (
            <Alert {...alert} key={alert.id}>{alert.message}</Alert>
        ))}
    </Box>
}
