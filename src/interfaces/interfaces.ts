import mongoose from "mongoose";
import { Request } from "express";
import { profile_role } from "../models/user-model";
export interface Ijobseekerskill {
  skill: string;
  user: mongoose.Schema.Types.ObjectId;
}

export interface IjobCategory {
  title: string;
  slug: string;
  active: boolean;
}

export interface decodedToken {
  _id: string;
  ext: number;
  iat: number;
}
export interface CustomRequest extends Request {
  user?: any;
  files: any;
  query: any;
  sessionId: any;
}

export interface CustomRequestBody<P, Q, T>
  extends Omit<Request, "query" | "params"> {
  user?: any;
  files: any;
  query: Q;
  sessionId: string;
  body: T;
  params: P;
}

