import { isAuthenticated } from "lib/auth";
import { isLoggedIn, isStaff } from "lib/auth/guards";
import { EventModel, EventData } from "lib/mongo/schema/event";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

//Exports list of tickets
export interface EventListResponse {
    events: EventData[]
}

export default Route<EventListResponse>(async (req, res) => {
    const client = isLoggedIn(req);
    const staff = isStaff(req);
    let events = await EventModel.find().select({ logs: 0 });
    res.json({
        events: events.map(o => o.toJSON()).map(o => {
            o.rsvp = client ? o.signups.includes(client.id) : false;
            delete o.signups;
            return o;
        })
    })
});
