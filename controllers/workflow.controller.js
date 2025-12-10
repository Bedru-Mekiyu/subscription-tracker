import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-email.js";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping the workflow`
    );
    return;
  }

  // Loop through reminder intervals
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    // If the reminder date is in the future, sleep until then
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate
      );
    }

    // Trigger the reminder
    if(dayjs().isSame(reminderDate,'date')){
    await triggerReminder(
      context,
      `Reminder ${daysBefore} days before`,
      subscription
    );
    }

  }
});


// Fetch subscription + populate user
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};


// Sleep until a specific date
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};


// Trigger reminder handler
const triggerReminder = async (context, label,subscription) => {
  return await context.run(label, async() => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail ({
        to:subscription.user.email,
        type:label,
        subscription,
    })
  });
};
