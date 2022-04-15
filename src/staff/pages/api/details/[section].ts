//Mockup API for retrieving text
//nightmarenightmarenightmare

import { isStaff } from "lib/auth/guards";
import { UpdateDocument } from "lib/mongo/utils";
import { StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";
import { FillableTextData } from ".";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    const { section } = req.query
    const doc = (await FillableTextData())?.[section as string];
    if (method == "GET") {
        res.json(doc || {})    
    } else if(method == "PATCH") {
        if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
        UpdateDocument(doc, req.body);
        await doc.save();
        res.json(doc);        
    } else if (method == 'OPTIONS') { res.send('ok') }
}