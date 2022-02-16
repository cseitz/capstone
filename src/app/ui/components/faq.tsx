import { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


//Add New FAQ Entries Here
const faqs = [
  {
    question: "How long did it take to make this accordion?",
    answer: "Too long."
  },
  {
    question: "Who made it?",
    answer: "I did."
  },
  {
    question: "Who are you?",
    answer: "Jake, from StateFarm."
  },
  {
    question: "What are you wearing, Jake from StateFarm",
    answer: "Nothing. B)"
  }
]


export function FAQ() {
  const [expanded, setExpanded] = useState<number>(-1);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : -1);
    };

  const info = faqs.map((x, i) => 
    <Accordion expanded = {expanded === i} onChange = {handleChange(i)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
        {x.question}
      </AccordionSummary>
      <AccordionDetails>
        {x.answer}
      </AccordionDetails>
    </Accordion>
  );

  return(<div>{info}</div>);

}