import { Box, Button, Grid, InputLabel, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import type { AboutDetails, LandingDetails } from "./api/details";

export default function DetailsPage() {
    return <Box sx={{ p: 2, maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h4">Details</Typography>
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
    const isChanged = data?.title != title || data?.subtitle != subtitle;

    const initialize = () => {
        setTitle(data?.title);
        setSubtitle(data?.subtitle);
    }

    useEffect(() => {
        if (isLoading || !data) return;
        initialize();
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

    const discard = () => {
        initialize();
    }

    return <Box sx={{ py: 2, px: 2 }}>

        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant="h5" sx={{ mb: 1 }}>Landing</Typography>
            </Grid>
            <Grid item xs={6}>
                {isChanged && <Button sx={{ float: 'right' }} onClick={discard}>Discard Changes</Button>}
            </Grid>

            <Grid item xs={12}>
                <TextField value={title} onChange={(event) => setTitle(event.target.value)} label="Title" placeholder="Title" fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField value={subtitle} onChange={(event) => setSubtitle(event.target.value)} label="Subtitle" placeholder="Subtitle" fullWidth />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button disabled={!isChanged} variant={isChanged ? 'contained' : 'outlined'} onClick={submit}>Save Changes</Button>
            </Grid>
        </Grid>

    </Box>
}

export function AboutDetailsPage() {
    const { isLoading, error, data, refetch } = useQuery<AboutDetails>(['details', 'about'], () => {
        return fetch('/api/details/about')
            .then(response => response.json())
    })
    const [content, setContent] = useState<string>(null);
    const [info, setInfo] = useState<string>(null);
    const isChanged = data?.content != content || data?.info != info;

    const initialize = () => {
        setContent(data?.content);
        setInfo(data?.info);
    }

    useEffect(() => {
        if (isLoading || !data) return;
        initialize();
    }, [isLoading, data])
    const submit = () => {
        fetch('/api/details/about', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ content, info })
        }).then(res => res.json()).then(res => console.log(res)).then(() => {
            refetch();
        })
    }

    const discard = () => {
        initialize();
    }

    return <Box sx={{ py: 2, px: 2 }}>

        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant="h5" sx={{ mb: 1 }}>About</Typography>
            </Grid>
            <Grid item xs={6}>
                {isChanged && <Button sx={{ float: 'right' }} onClick={discard}>Discard Changes</Button>}
            </Grid>

            <Grid item xs={12}>
                <TextField value={info} onChange={(event) => setInfo(event.target.value)} label="Info" placeholder="Info" fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField value={content} onChange={(event) => setContent(event.target.value)} label="Content" placeholder="Content" fullWidth multiline minRows={3} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button disabled={!isChanged} variant={isChanged ? 'contained' : 'outlined'} onClick={submit}>Save Changes</Button>
            </Grid>
        </Grid>

    </Box>
}