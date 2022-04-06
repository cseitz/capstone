import { isAuthenticated } from "lib/auth";
import { EventModel, EventData } from "lib/mongo/schema/event";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

//Exports list of tickets
export interface EventListResponse {
    events: EventData[]
}

//makes sure the request is coming from an authenticated user
const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<EventListResponse>(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const events = await EventModel.find()
    res.json({
        events
    })
});