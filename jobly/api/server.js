import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handleRequest = createRequestHandler(build, process.env.NODE_ENV);

export default async function handler(request) {
  return handleRequest(request);
}
