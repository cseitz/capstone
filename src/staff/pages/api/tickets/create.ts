import { isAuthenticated } from "lib/auth";
import { TicketDocument, TicketModel } from "lib/mongo/schema/ticket";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

//Exports list of tickets
export interface TicketListResponse {
    ticket: TicketDocument
}

export default Route<TicketListResponse>(async (req, res) => {
    const { method } = req;
    if (method != 'POST')
        throw new StatusError(405, 'Method Not Allowed');
    const {name, email, subject, message} = req.body;
    const ticket = new TicketModel({
        name: name,
        email: email,
        subject: subject,
        message: message
    });
    await ticket.audit({
        process: 'system'
    })
    await ticket.save();
    return res.json({ticket});
});