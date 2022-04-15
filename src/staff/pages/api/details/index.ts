//Mockup API for retrieving text
//nightmarenightmarenightmare

import { NextApiRequest, NextApiResponse } from "next";
import { Details } from "lib/mongo/schema/details";

export interface LandingDetails {
    title: string;
    subtitle: string;
    logo: string;
}

export interface AboutDetails {
    info: string;
    content: string;
}

export interface FAQDetails {
    questions: {
        id: string;
        question: string;
        answer: string;
    }[]
}

const Landing = Details<LandingDetails>('landing', {
    title: {
        type: String,
        default: 'Never Forget'
    },
    subtitle: {
        type: String,
        default: 'September 11th 2001'
    },
    logo: {
        type: String,
        default: '/assets/logo.png'
    }
})


const About = Details<AboutDetails>('about', {
    info: {
        type: String,
        default: 'No Maidens'
    },
    content: {
        type: String,
        default: 'Chicken Nuggets'
    }
})

import { v4 as uuidv4 } from 'uuid';
const FAQ = Details<FAQDetails>('faq', {
    questions: {
        type: [{
            id: {
                type: String,
                default: uuidv4(),
            },
            question: String,
            answer: String,
        }],
        default: [
            {
                id: uuidv4(),
                question: "How long did it take to make this accordion?",
                answer: "Too long."
            },
            {
                id: uuidv4(),
                question: "Who made it?",
                answer: "I did."
            },
            {
                id: uuidv4(),
                question: "Who are you?",
                answer: "Jake, from StateFarm."
            },
            {
                id: uuidv4(),
                question: "What are you wearing, Jake from StateFarm",
                answer: "Nothing. B)"
            }
        ]
    }
})

export async function FillableTextData() {
    return {
        landing: await (await Landing)(),
        about: await (await About)(),
        faq: await (await FAQ)(),
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(await FillableTextData())
}