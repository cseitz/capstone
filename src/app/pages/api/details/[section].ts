//Mockup API for retrieving text
//nightmarenightmarenightmare

import { NextApiRequest, NextApiResponse } from "next";
import { FillableTextData } from ".";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { section } = req.query   
    res.json(FillableTextData?.[section as string] || {})
}