//Mockup API for retrieving text
//nightmarenightmarenightmare

import { NextApiRequest, NextApiResponse } from "next";

export const FillableTextData = {
    landing: {
        title: "",
        subtitle: "",
        backgroundImage: "",
        logo: "/assets/logo.png",
    },
    about: {
        info: "",
        content: "",
        image: "",
        backgroundImage: ""
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.json(FillableTextData)
}