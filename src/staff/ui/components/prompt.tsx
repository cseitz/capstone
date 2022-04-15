import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { createElement, useState } from "react";


interface BasePrompt<Data = {}> {
    title?: string | JSX.Element | ((context: BasePrompt<Data>) => JSX.Element);
    content?: string | JSX.Element | ((context: BasePrompt<Data>) => JSX.Element);
    actions?: string | JSX.Element | ((context: BasePrompt<Data>) => JSX.Element);

    render?: (context: BasePrompt<Data>) => JSX.Element;
    Provider?: () => JSX.Element;

    isOpen: boolean;
    setOpen: (state: boolean) => void;
    data?: Data

    [key: string]: any;
}

export function usePrompt<Data = {}>(prompt: Partial<BasePrompt<Data>>) {
    const [open, setOpen] = useState(prompt?.isOpen);
    prompt.isOpen = open;
    prompt.setOpen = setOpen;
    prompt.render = prompt?.render || RenderPrompt;
    prompt.Provider = () => prompt.render(prompt as BasePrompt<Data>);

    return Object.assign(function (data: Data | boolean) {
        if (typeof data == 'boolean') return setOpen(data);
        if (!open) setOpen(true);
        prompt.data = data;
    }, prompt as BasePrompt<Data>);
}

function RenderPrompt(prompt: BasePrompt) {
    const [title, content, actions] = [prompt?.title, prompt?.content, prompt?.actions].map(O => {
        if (!O) return undefined;
        if (typeof O == 'function') return createElement(O, prompt);
        return O;
    })
    return <Dialog open={prompt.isOpen} onClose={() => prompt.setOpen(false)}>
        {title && <DialogTitle>{title}</DialogTitle>}
        {content && <DialogContent>{content}</DialogContent>}
        {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
}

