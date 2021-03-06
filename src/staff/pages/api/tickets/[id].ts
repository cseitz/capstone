import { isAuthenticated } from "lib/auth";
import { isAdmin, isStaff } from "lib/auth/guards";
import { TicketData, TicketModel } from "lib/mongo/schema/ticket";
import { UpdateDocument } from "lib/mongo/utils";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export interface TicketResponse {
    ticket?: TicketData
}


export default Route<TicketResponse>(async (req, res) => {
    const client = isStaff(req);
    const { method, headers, query } = req;
    if (!client) throw new StatusError(403, 'Unauthorized');
    const ticket = await TicketModel.findById(req.query.id);
    if (method == 'GET') {
        return res.json({
            ticket
        })
    } else if (method == 'PATCH') {
        await ticket.audit({
            user: client.id,
        })
        UpdateDocument(ticket, req.body);
        if ('status' in req.body) {
            ticket.assignee = client.id;
        }
        await ticket.commitWith(req, {
            action: 'Updated Ticket',
        });
        await ticket.save();
        return res.json({
            ticket
        })
    } else if (method == 'DELETE') {
        if (!isAdmin(req)) throw new StatusError(403, 'Unauthorized');
        await ticket.audit({
            user: client.id,
        })
        await ticket.remove();
        return res.json({
            ticket
        })
    }
}, {
    methods: ['GET', 'PATCH', 'DELETE']
});