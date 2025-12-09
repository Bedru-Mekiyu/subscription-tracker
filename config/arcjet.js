import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    // Security protection but does not block bots
    shield({ mode: "LIVE" }),

    // Bot detection safe for Postman/local testing
    detectBot({
      mode: "DRY_RUN",     // <-- DOES NOT BLOCK
      allow: [
        "IP:127.0.0.1",    // Allow Postman / localhost
        "IP:::1",
        "CATEGORY:SEARCH_ENGINE"
      ]
    }),

    // Rate limit still active
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    })
  ],
});

export default aj;
