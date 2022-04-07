import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import type { AboutDetails, LandingDetails } from "./api/details";

export default function DetailsPage() {
    return <Box sx = {{p:2}}>
        <LandingDetailsPage />
        <AboutDetailsPage />
    </Box>
}

export function LandingDetailsPage() {
    const { isLoading, error, data, refetch } = useQuery<LandingDetails>(['details', 'landing'], () => {
        return fetch('/api/details/landing')
            .then(response => response.json())
    })
    const [title, setTitle] = useState<string>(null);
    const [subtitle, setSubtitle] = useState<string>(null);
    useEffect(() => {
        if (isLoading || !data) return;
        setTitle(data?.title);
        setSubtitle(data?.subtitle);
    }, [isLoading, data])
    const submit = () => {
        fetch('/api/details/landing', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ title, subtitle, })
        }).then(res => res.json()).then(res => console.log(res)).then(() => {
            refetch();
        })
    }
    return <Box>
        <Typography>Landing Page Text: </Typography>
        <TextField value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
        <TextField value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Subtitle" />
        <Button onClick={submit}>Save Changes</Button>
    </Box>
}

export function AboutDetailsPage() {
    const { isLoading, error, data, refetch } = useQuery<AboutDetails>(['details', 'about'], () => {
        return fetch('/api/details/about')
            .then(response => response.json())
    })
    const [content, setContent] = useState<string>(null);
    const [info, setInfo] = useState<string>(null);
    useEffect(() => {
        if (isLoading || !data) return;
        setContent(data?.content);
        setInfo(data?.info);
    }, [isLoading, data])
    const submit = () => {
        fetch('/api/details/about', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ content, info, })
        }).then(res => res.json()).then(res => console.log(res)).then(() => {
            refetch();
        })
    }
    return <Box>
        <Typography>About Page Text: </Typography>
        <TextField value={info} onChange={(event) => setInfo(event.target.value)} placeholder="Info" />
        <TextField value={content} onChange={(event) => setContent(event.target.value)} placeholder="Content" />
        <Button onClick={submit}>Save Changes</Button>
    </Box>
}