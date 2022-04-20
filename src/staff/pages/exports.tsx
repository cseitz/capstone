import React, { useCallback, useState } from 'react'
import { Button, CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useAlert } from 'ui/components/alert';
import Head from 'next/head';
import { title } from 'ui/components/navbar';


const endpoints: {
    key: string,
    title: JSX.Element | string,
    description: JSX.Element | string,
}[] = [
        {
            key: 'logs',
            title: 'Audit Logs',
            description: 'All Audit logs can be downloaded here.',
        },
        {
            key: 'users',
            title: 'User List',
            description: 'All Users can be downloaded here.',
        }
    ]


// The exports page shows various export endpoints and allows downloading of their CSV files.
export default function ExportsPage() {

    const Endpoints = endpoints.map(endpoint => {
        return <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }} key={endpoint.key}>
            <Box>
                <Typography variant="h5">
                    {endpoint.title}
                </Typography>
                <Typography>{endpoint.description}</Typography>
            </Box>
            <Box sx={{ p: 1 }}>
                <ExportsLink url={endpoint.key} />
            </Box>
        </Box>
    });

    return <>
        <Head>
            <title>{title} - Exports</title>
        </Head>

        <Box sx={{ maxWidth: "800px", mx: "auto", p: 2 }}>

            <Typography variant="h4">Exports</Typography>

            {Endpoints}

        </Box>
    </>
}

// The exports link provides a fancy button for downloading the CSV's
function ExportsLink(props: {
    url: string
}) {
    const alert = useAlert();
    const { url } = props;

    let [isLoading, setIsLoading] = useState(false);
    const endpoint = '/api/exports/' + url;

    const download = useCallback(async () => {
        setIsLoading(true);
        const minDuration = new Promise(resolve => {
            setTimeout(function () {
                resolve(true);
            }, 500)
        });
        fetch(endpoint).then(async (res) => {
            if (!res.ok) throw (await res.json())?.error;
            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = decodeURIComponent(res.headers.get('content-disposition')).match(/filename="(.+)"/)[1];
            await minDuration;
            a.click();
            setIsLoading(false);
            alert.success('Downloaded File', {
                unique: 'exports.download',
                duration: 2000,
            });
        }).catch(err => {
            setIsLoading(false);
            alert.error('Download Failed: ' + err, {
                unique: 'exports.download',
                duration: 2000,
            });
            console.error('event.remove', err);
        })
    }, [endpoint, setIsLoading]);
    const pre = isLoading ? <CircularProgress size={24} variant="indeterminate" sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-12px',
        marginLeft: '-12px',
    }} /> : '';
    return <Box sx={{ m: 1, position: 'relative' }}>
        <Button variant='contained' fullWidth disabled={isLoading} onClick={() => download()}>
            Download
        </Button>
        {pre}
    </Box>

}
