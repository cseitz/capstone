import React, { useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useAlert } from 'ui/components/alert';
import Link from 'next/link'

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

export default function ExportsPage() {
    return (
        <Box sx={{ maxWidth: "800px", mx: "auto", p: 2 }}>
            <Typography variant="h4">Exports</Typography>
            {endpoints.map(endpoint => {
                return <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }} key={endpoint.key}>
                    <Box>
                        <Typography variant="h5">
                            {endpoint.title}
                        </Typography>
                        <Typography>{endpoint.description}</Typography>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <Link href={"/api/exports/" + endpoint.key}>
                            <Button variant="contained">Download</Button>
                        </Link>
                    </Box>
                </Box>
            })}
        </Box>
    );
}