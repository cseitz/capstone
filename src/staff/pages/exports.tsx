import React, { useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useAlert } from 'ui/components/alert';
import Link from 'next/link'


export default function BasicButtons() {
    return(
        <Box sx={{maxWidth:"800px", mx:"auto"}}>
            <br />
            <Box>
                <Typography variant = "h5">
                    Audit Logs
                    <Link href={"/api/exports/logs"}>
                    <Button variant="contained" sx={{ float: "right"}}>Download</Button>
                    </Link>
                </Typography>
                <Typography> All Audit logs can be downloaded here.</Typography>
            </Box>
            <br />
            <Box>
                <Typography variant = "h5">
                    User Logs
                    <Link href={"/api/exports/users"}>
                    <Button variant="contained" sx={{ float: "right"}}>Download</Button>
                    </Link>
                </Typography>
                <Typography> All User logs can be downloaded here.</Typography>
            </Box>

        </Box>
    );
}