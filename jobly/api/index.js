import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handleRequest = createRequestHandler(build, process.env.NODE_ENV);

export default async function handler(request) {
  try {
    // Vercel handles the standard Request/Response API.
    // If request.url is just a path, construct a full URL.
    const url = new URL(request.url, `https://${request.headers.get("host") || "localhost"}`);
    
    // Create a new Request object with the absolute URL if it's not already absolute
    const newRequest = new Request(url.href, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      duplex: 'half'
    });

    return await handleRequest(newRequest);
  } catch (error) {
    console.error("Vercel Function Error:", error);
    return new Response(
      `Internal Server Error: ${error.message}`, 
      { status: 500 }
    );
  }
}
