//Mockup API for retrieving text
//nightmarenightmarenightmare

import { NextApiRequest, NextApiResponse } from "next";

export const FillableTextData = {
    landing: {
        title: "NEVER FORGET",
        subtitle: "Sep 11th 2001",
        backgroundImage: "",
        logo: "http://divisqueeze.com/wp-content/uploads/2017/03/YourLogoHere.png",
    },
    about: {
        info: "No Maidens?",
        content: "This is more information to be put into another box",
        image: "",
        backgroundImage: ""
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.json(FillableTextData)
}