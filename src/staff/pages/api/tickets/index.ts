import { isAuthenticated } from "lib/auth";
import { TicketData, TicketModel } from "lib/mongo/schema/ticket";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

//Exports list of tickets
export interface TicketListResponse {
    tickets: TicketData[]
}

//makes sure the request is coming from an authenticated user
const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})
export default Route<TicketListResponse>(async (req, res) => {
    if (!isStaff(req)) throw new StatusError(403, 'Unauthorized');
    let { status } = req.query;
    const filter = { status };
    if (!status) delete filter.status;
    const tickets = await TicketModel.find(filter)
    res.json({
        tickets
    })
});