import { createRequestHandler } from "react-router";
import * as build from "../build/server/index.js";

const handleRequest = createRequestHandler(build, process.env.NODE_ENV);

export default async function handler(request) {
  try {
    const url = new URL(request.url, `https://${request.headers.get("host") || "localhost"}`);
    
    // Some headers and methods don't allow body
    const hasBody = !["GET", "HEAD"].includes(request.method);
    
    const newRequest = new Request(url.href, {
      method: request.method,
      headers: request.headers,
      body: hasBody ? request.body : null,
      // duplex is required when passing a stream body to Request constructor in Node.js
      ...(hasBody && { duplex: 'half' })
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
