import PusherClient from "pusher-js";

// Handle CJS/ESM interop issues with pusher-js in Next.js Turbopack
const Pusher = typeof PusherClient === "function" 
  ? PusherClient 
  : (PusherClient as any).Pusher || (PusherClient as any).default || PusherClient;

export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);

