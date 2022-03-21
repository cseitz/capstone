import { AlertProps } from "@mui/material";
import { createRenderAuthority, RenderAuthority } from "lib/hooks";
import { uniqueId } from "lodash";
import { createContext, useContext } from "react";


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
    authority: RenderAuthority;
}

const AlertGlobalContext = {
    alerts: [],
    authority: createRenderAuthority(),
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

