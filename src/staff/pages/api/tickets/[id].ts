import { isAuthenticated } from "lib/auth";
import { TicketData, TicketModel } from "lib/mongo/schema/ticket";
import { UpdateDocument } from "lib/mongo/utils";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface TicketResponse {
    ticket?: TicketData
}


const isStaff = isAuthenticated({
    role: ['pending', 'user', 'staff', 'admin']
})
//Returns ticket based off id
export default Route<TicketResponse>(async (req, res) => {
    const client = isStaff(req);
    const { method, headers, query } = req;
    //If staff is not pulling the tickets, throw error
    if (!client) throw new StatusError(403, 'Unauthorized');
    const ticket = await TicketModel.findById(req.query.id);
    //If GET used, send ticket
    if (method == 'GET') {
        return res.json({
            ticket
        })
        //If Patch is used
    } else if (method == 'PATCH') {
        await ticket.audit({
            user: client.id,
        })
        //Assign ticket assignee to the staff changing the status
        UpdateDocument(ticket, req.body);
        if ('status' in req.body) {
            ticket.assignee = client.id;
        }
        //Show its updated
        await ticket.commitWith(req, {
            action: 'Updated Ticket',
        });
        //Save changed ticket and send
        await ticket.save();
        return res.json({
            ticket
        })
    }
}, {
    methods: ['GET', 'PATCH']
});