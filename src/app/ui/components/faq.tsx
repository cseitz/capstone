import { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery } from 'react-query';
import type { FAQDetails } from 'staff/pages/api/details';


// Frequently Asked Questions
export function FAQ() {
    // pull details from the API
    const { isLoading, error, data = { questions: [] } } = useQuery<FAQDetails>(['details', 'faq'], () => {
        return fetch('/api/details/faq')
            .then(response => response.json())
    })

    const { questions = [] } = data;

    // make only one accordion open at once
    const [expanded, setExpanded] = useState<number>(-1);
    const handleChange = (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : -1);
    };

    return <>
        {questions.map((x, i) =>
            <Accordion expanded={expanded === i} onChange={handleChange(i)} key={x.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
                    {x.question}
                </AccordionSummary>
                <AccordionDetails>
                    {x.answer}
                </AccordionDetails>
            </Accordion>
        )}
    </>

}