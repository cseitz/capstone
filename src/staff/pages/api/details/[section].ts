//Mockup API for retrieving text
//nightmarenightmarenightmare

import { NextApiRequest, NextApiResponse } from "next";
import { FillableTextData } from ".";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { section } = req.query   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json((await FillableTextData())?.[section as string] || {})
}