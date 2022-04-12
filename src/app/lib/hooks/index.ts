import { isArray, mergeWith } from 'lodash';

export * from './useRenderAuthority';

export function UseToggleList(list: {
    [key: string]: any
}) {
    return Object.entries(list)
    .filter(o => o[1])
    .map(o => o[0]);
}

export function mergeProps<T = any>(...args: (Partial<T> | { [key: string]: any })[]): T {
    if (args.length == 1) return args[0] as any;
    const [a, b, ...rest] = args;
    const result = mergeWith(a, b, function(obj, src, key) {
        if (isArray(obj)) return obj.concat(src);
        if (key == 'className') return [...obj.split(' '), ...src.split(' ')].filter(o => o.length > 0).join(' ');
    });
    return mergeProps(result, ...rest);
}


export function scrollbarWidth() {
    if (typeof window == 'undefined') return 0;
    let outer = document.getElementById('scroll-detect');
    let inner;
    if (!outer) {
        outer = document.createElement('div');
        outer.id = 'scroll-detect';
        Object.assign(outer.style, {
            position: 'fixed',
            visibility: 'hidden',
            overflow: 'scroll',
            pointerEvents: 'none',
        })
        document.body.appendChild(outer);
        inner = document.createElement('div');
        outer.appendChild(inner);
    } else {
        inner = outer.firstChild;
    }
    return outer.offsetWidth - inner.offsetWidth;
}
