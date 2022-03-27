import { isAuthenticated } from "lib/auth";
import { TicketDocument, TicketModel } from "lib/mongo/schema/ticket";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

//Exports list of tickets
export interface TicketListResponse {
    tickets: TicketDocument[]
}

//makes sure the request is coming from an authenticated user
const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<TicketListResponse>(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    const tickets = await TicketModel.find()
    res.json({
        tickets
    })
});