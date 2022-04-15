import { isAuthenticated } from "lib/auth";
import { EventModel, EventData } from "lib/mongo/schema/event";
import { UpdateDocument } from "lib/mongo/utils";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface EventResponse {
    rsvp: boolean
}

const isLoggedIn = isAuthenticated({})

export default Route<EventResponse>(async (req, res) => {
    const client = isLoggedIn(req);
    if (!client) return res.json({ rsvp: false });
    const { method, headers, query } = req;
    const event = await EventModel.findById(req.query.id);
    const rsvp = client ? event.signups.includes(client.id) : false;
    if (method == 'GET') {
        return res.json({
            rsvp
        })
    } else if (method == 'POST') {
        if (rsvp) return res.json({
            rsvp
        });
        // @ts-ignore
        event._bypassAudit = true;
        event.signups.push(client.id);
        await event.save();
        return res.json({
            rsvp: true
        })
    } else if (method == 'DELETE') {
        if (!rsvp) return res.json({
            rsvp
        });
        // @ts-ignore
        event._bypassAudit = true;
        // @ts-ignore
        event.signups.pull(client.id);
        await event.save();
        return res.json({
            rsvp: false
        })
    }
}, {
    methods: ['GET', 'POST', 'DELETE']
});