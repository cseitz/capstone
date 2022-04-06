import { isAuthenticated } from "lib/auth";
import { TicketDocument, TicketModel } from "lib/mongo/schema/ticket";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface TicketResponse {
    ticket?: TicketDocument
}

const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})

export default Route<TicketResponse>(async (req, res) => {
    const user = isStaff(req);
    const { method, headers, query } = req;
    if (!user) throw new StatusError(403, 'Unauthorized');
    const ticket = await TicketModel.findById(req.query.id);
    //ticket.assignee = user.id;
    if (method == 'GET') {
        return res.json({
            ticket
        })
    }
});