import { Add, ArrowDropDown, ArrowDropUp, Delete, ExpandMore, PlusOne } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Collapse, Divider, Grid, IconButton, InputLabel, ListItem, ListItemText, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import type { AboutDetails, FAQDetails, LandingDetails } from "./api/details";
import { v4 as uuidv4 } from 'uuid';

export default function DetailsPage() {
    return <Box sx={{ p: 2, maxWidth: '1000px', mx: 'auto' }}>
        <Typography variant="h4">Details</Typography>
        <LandingDetailsPage />
        <AboutDetailsPage />
        <FAQDetailsPage />
    </Box>
}

function DetailsComponent(props: {
    children: any;
    title: string;
    isChanged: boolean;
    discard,
    submit,
}) {
    const { title, isChanged, discard, submit, children } = props;
    const isMobile = useMediaQuery('(max-width:600px)');
    return <Box sx={{ py: 2, px: 2 }}>

        <Grid container spacing={2}>
            <Grid item xs={isMobile ? 12 : 6}>
                <Typography variant="h5" sx={{ mb: 1, textAlign: isMobile ? 'center' : undefined }}>{title}</Typography>
            </Grid>
            {!isMobile && <Grid item xs={6}>
                {isChanged && <Button sx={{ float: 'right' }} onClick={discard}>Discard Changes</Button>}
            </Grid>}

            {children}

            {isChanged && <>
                <Grid item xs={isMobile ? 4 : 12} sx={{ textAlign: 'center' }}>
                    <Button disabled={!isChanged} variant={isChanged ? 'contained' : 'outlined'} onClick={submit} fullWidth={isMobile}>Save {!isMobile && 'Changes'}</Button>
                </Grid>
                {isMobile && <>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>

                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                        <Button disabled={!isChanged} sx={{ float: 'right' }} onClick={discard}>Cancel</Button>
                    </Grid>
                </>}
            </>}

        </Grid>

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

    return <DetailsComponent {...{
        title: 'Landing',
        isChanged,
        discard,
        submit,
    }}>
        <Grid item xs={12}>
            <TextField value={title} onChange={(event) => setTitle(event.target.value)} label="Title" placeholder="Title" fullWidth />
        </Grid>
        <Grid item xs={12}>
            <TextField value={subtitle} onChange={(event) => setSubtitle(event.target.value)} label="Subtitle" placeholder="Subtitle" fullWidth />
        </Grid>
    </DetailsComponent>
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

    return <DetailsComponent {...{
        title: 'About',
        isChanged,
        discard,
        submit,
    }}>
        <Grid item xs={12}>
            <TextField value={info} onChange={(event) => setInfo(event.target.value)} label="Info" placeholder="Info" fullWidth />
        </Grid>
        <Grid item xs={12}>
            <TextField value={content} onChange={(event) => setContent(event.target.value)} label="Content" placeholder="Content" fullWidth multiline minRows={3} />
        </Grid>
    </DetailsComponent>
}


export function FAQDetailsPage() {
    const { isLoading, error, data, refetch } = useQuery<FAQDetails>(['details', 'faq'], () => {
        return fetch('/api/details/faq')
            .then(response => response.json())
    })
    const [questions, setQuestions] = useState<FAQDetails['questions']>(null);
    const isChanged = JSON.stringify(data?.questions) != JSON.stringify(questions)

    const initialize = () => {
        setQuestions(JSON.parse(JSON.stringify(data?.questions)));
    }

    useEffect(() => {
        if (isLoading || !data) return;
        initialize();
    }, [isLoading, data])
    const submit = () => {
        fetch('/api/details/faq', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ questions })
        }).then(res => res.json()).then(res => console.log(res)).then(() => {
            refetch();
        })
    }

    const discard = () => {
        initialize();
    }

    const isMobile = useMediaQuery('(max-width:600px)');

    const cols = 12; //isMobile ? 12 : 18;
    const entries = (questions || []).map((entry, index) => {
        const { id, question, answer } = entry;
        const isLast = index == questions.length - 1;
        const isFirst = index == 0;
        const swap = (direction: number) => {
            const adjusted = [
                ...questions.slice(0, index),
                ...questions.slice(index + 1),
            ];
            adjusted.splice(index + direction, 0, questions[index]);
            setQuestions(adjusted);
        };
        return <Grid item key={id} xs={cols}>
            <Box sx={{ mb: isLast ? 0 : 1, pt: 2, pb: isLast ? 1 : 2 }}>
                <Grid container spacing={2}>
                    <Grid item sx={{ width: 'calc(100% - 70px - 70px)' }}>
                        <TextField fullWidth label="Question" value={question} onChange={(event) => { entry.question = event.target.value; setQuestions([...questions]) }} />
                    </Grid>
                    <Grid item sx={{ width: '70px' }}>
                        <IconButton sx={{ float: 'right', ml: '10px' }} onClick={() => setQuestions([...questions].filter(o => o.id != id))}>
                            <Delete />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton sx={{ float: 'right', ml: '10px' }} disabled={isFirst} onClick={() => swap(-1)}>
                            <ArrowDropUp />
                        </IconButton>
                    </Grid>
                    <Grid item sx={{ width: 'calc(100% - 70px)' }}>
                        <TextField fullWidth label="Answer" multiline value={answer} onChange={(event) => { entry.answer = event.target.value; setQuestions([...questions]) }} />
                    </Grid>
                    <Grid item>
                        <IconButton sx={{ float: 'right', ml: '10px' }} disabled={isLast} onClick={() => swap(1)}>
                            <ArrowDropDown />
                        </IconButton>
                    </Grid>

                </Grid>
            </Box>
            {!isLast && <Divider />}
        </Grid>
    })

    const [expanded, setExpanded] = useState<boolean>(true);
    return <DetailsComponent {...{
        title: 'Frequently Asked Questions',
        isChanged,
        discard,
        submit,
    }}>
        <Grid item xs={12}>
            <Collapse in={expanded}>
                <Grid container spacing={2}>
                    {entries}
                </Grid>
            </Collapse>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button variant="outlined" endIcon={<Add />} onClick={() => {
                    if (!expanded) return setExpanded(true);
                    setQuestions([
                        ...questions,
                        {
                            id: uuidv4(),
                            question: '',
                            answer: '',
                        }
                    ])
                }} fullWidth={isMobile}>{expanded ? 'Add Entry' : 'Show'}</Button>
        </Grid>

    </DetailsComponent >
}