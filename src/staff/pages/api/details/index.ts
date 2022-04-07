//Mockup API for retrieving text
//nightmarenightmarenightmare

import { NextApiRequest, NextApiResponse } from "next";
import { Details } from "lib/mongo/schema/details";

const Landing = Details<{
    title: string;
    subtitle: string;
    logo: string;
}>('landing', {
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


const About = Details<{
    info: string;
    content: string;
}>('about', {
    info: {
        type: String,
        default: 'No Maidens'
    } ,
    content: {
        type: String,
        default: 'Chicken Nuggets'
    }
})

export const FillableTextData = new Promise(async (resolve) => {
    resolve ({
        landing: await Landing,
        about: await About
    })
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(await FillableTextData)
}