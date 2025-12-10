// config/arcjet.js

import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    // Change mode to DRY_RUN during development
    detectBot({
      mode: "DRY_RUN",  // ← This logs bots but DOES NOT block them
      allow: [
        "IP:127.0.0.1",
        "IP:::1",
        "CATEGORY:SEARCH_ENGINE"
      ]
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    })
  ],
});

export default aj;