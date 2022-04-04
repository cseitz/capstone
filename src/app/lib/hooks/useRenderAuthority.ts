import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';

const authorities = {};
export class RenderAuthority extends EventTarget {
    id: string;

    constructor(id = uuidv4()) {
        super();
        if (id in authorities) return authorities[id];
        this.id = id;
        authorities[id] = this;
    }

    render(detail?: any) {
        if (typeof window != 'undefined')
            this.dispatchEvent(new CustomEvent('render', { detail }));
    }
    hook(cb) {
        this.addEventListener('render', cb);
        return () => {
            this.removeEventListener('render', cb);
        }
    }

    rename(id: string) {
        const old = this.id;
        this.id = id;
        authorities[id] = this;
    }
}

export function useRenderAuthority(authority: RenderAuthority | any, filter?: any) {
    if ('renderAuthority' in authority) authority = authority.renderAuthority;
    if (typeof authority == 'string') {
        if (authority in authorities) {
            authority = authorities[authority];
        } else {
            authority = createRenderAuthority(authority);
        }
    }
    const [counter, setCounter] = useState(0);
    const listener = function(event) {
        if (filter) {
            if (typeof filter == 'string') {
                let ok = false;
                if (event?.detail) {
                    const { detail } = event;
                    if (typeof detail == 'string') {
                        if (detail == filter) ok = true;
                        else if (detail.split(',').includes(filter)) ok = true;
                    }
                }
                if (!ok) return;
            } else if (!filter(event)) return;
        }
        setCounter(counter + 1);
    };
    useEffect(() => {
        return authority.hook(listener)
    }, [counter]);
    return counter;
}

export function createRenderAuthority(id?: string) {
    return new RenderAuthority(id);
}