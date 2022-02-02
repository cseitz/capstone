import { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function FAQ() {
  return (
    <div>
       <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>As I get older, I remember all the people I lost along the way.</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Maybe my budding career as a tour guide was not the right choice.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>My mom died when we couldn’t remember her blood type.</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          As she died, she kept telling us to “be positive,” but it’s hard without her.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>I have a stepladder...</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          ...because my real ladder left when I was 5.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const faqs = [ { question: "", answer: "" } ];