//Mockup API for retrieving text
//nightmarenightmarenightmare

import { UpdateDocument } from "lib/mongo/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { FillableTextData } from ".";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    const { section } = req.query
    const doc = (await FillableTextData())?.[section as string];
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (method == "GET") {
        res.json(doc || {})    
    } else if(method == "PATCH") {
        UpdateDocument(doc, req.body);
        await doc.save();
        res.json(doc);        
    } else if (method == 'OPTIONS') { res.send('ok') }
}