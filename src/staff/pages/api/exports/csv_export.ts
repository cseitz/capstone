import { isAuthenticated } from "lib/auth";
import { UserData, UserDocument, UserModel } from "lib/mongo/schema/user";
import { Route, StatusError } from "lib/route";
import { NextApiRequest, NextApiResponse } from "next";

export default function csvConverter(req, res) {
    res.status(200).json({ name: 'csv data' })
    
  }