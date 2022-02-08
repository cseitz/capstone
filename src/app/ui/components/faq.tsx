import { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const faqs = [
  {
    question: "As I get older, I remember all the people I lost along the way.",
    answer: "Maybe my budding career as a tour guide was not the right choice."
  },
  {
    question: "My mom died when we couldn’t remember her blood type.",
    answer: "As she died, she kept telling us to “be positive,” but it’s hard without her."
  },
  {
    question: "I have a stepladder...",
    answer: "...because my real ladder left when I was 5."
  }
]


export function FAQ() {
  //const [isActive, setIsActive] = useState(false);


  const info = faqs.map((x) => 
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        {x.question}
      </AccordionSummary>
      <AccordionDetails>
        {x.answer}
      </AccordionDetails>
    </Accordion>
  );

  return(<div>{info}</div>);

}