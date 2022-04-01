import { isAuthenticated } from "lib/auth";
import { EventDocument, EventModel, EventData } from "lib/mongo/schema/event";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface EventResponse {
    event?: EventDocument
}

const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<EventResponse>(async (req, res) => {
    const user = isStaff(req);
    if (!user) throw new StatusError(403, 'Unauthorized');
    const { title, description, startsAt, endsAt, type } = req.body;
    const event = new EventModel({
        title,
        description,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        type
    });
    await event.audit({
        user: user.id
    });
    await event.commitWith(req, {
        action: "Create Event"
    });
    await event.save();

    res.json({
        event
    })
},
{
    methods: ["POST"]
}
);

