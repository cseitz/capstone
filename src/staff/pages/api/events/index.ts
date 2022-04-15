import { isAuthenticated } from "lib/auth";
import { EventModel, EventData } from "lib/mongo/schema/event";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

//Exports list of tickets
export interface EventListResponse {
    events: EventData[]
}

//makes sure the request is coming from an authenticated user
const isLoggedIn = isAuthenticated({});
const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<EventListResponse>(async (req, res) => {
    const client = isLoggedIn(req);
    const staff = isStaff(req);
    // if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', '*');
    // res.setHeader('Access-Control-Allow-Headers', '*');
    let events = await EventModel.find().select({ logs: 0 });
    res.json({
        events: events.map(o => o.toJSON()).map(o => {
            o.rsvp = client ? o.signups.includes(client.id) : false;
            delete o.signups;
            return o;
        })
    })
});
