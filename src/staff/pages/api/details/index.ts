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

const Landing = Details<LandingDetails>('landing', {
    title: {
        type: String,
        default: 'Never Forget'
    } ,
    subtitle: {
        type: String,
        default: 'September 11th 2001'
    } ,
    logo: {
        type: String,
        default: '/assets/logo.png'
    }
})


const About = Details<AboutDetails>('about', {
    info: {
        type: String,
        default: 'No Maidens'
    } ,
    content: {
        type: String,
        default: 'Chicken Nuggets'
    }
})

export async function FillableTextData() {
    return {
        landing: await (await Landing)(),
        about: await (await About)()
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(await FillableTextData())
}