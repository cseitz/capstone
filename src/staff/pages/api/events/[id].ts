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
    const event = await EventModel.findById(req.query.id);
    res.json({
        event
    })
});