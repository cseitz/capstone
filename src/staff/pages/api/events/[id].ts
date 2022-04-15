import { isAuthenticated } from "lib/auth";
import { EventModel, EventData } from "lib/mongo/schema/event";
import { UpdateDocument } from "lib/mongo/utils";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface EventResponse {
    event?: EventData
}

const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<EventResponse>(async (req, res) => {
    const client = isStaff(req);
    const { method, headers, query } = req;
    const event = await EventModel.findById(req.query.id);
    if (method == 'GET') {
        return res.json({
            event
        })
    } else if (method == 'PATCH') {
        if (!client) throw new StatusError(403, 'Unauthorized');
        await event.audit({
            user: client.id,
        })
        UpdateDocument(event, req.body);
        await event.commitWith(req, {
            action: 'Updated Event',
        });
        await event.save();
        return res.json({
            event
        })
    } else if (method == 'DELETE') {
        if (!client) throw new StatusError(403, 'Unauthorized');
        await event.audit({
            user: client.id,
        })
        await event.remove();
        return res.json({
            event
        })
    }
}, {
    methods: ['GET', 'PATCH', 'DELETE']
});