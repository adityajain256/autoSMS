# Scheduled Client Flags Updater

This script (`updateClientFlags.ts`) uses a cron job to automatically reset the `paymentReminderSent` and `welcomeMessageSent` fields of all Client records every Monday at 00:00.

## How it works
- Connects to the MongoDB database using your existing config.
- Schedules a cron job (using `node-cron`) to run every Monday at midnight.
- Updates all Client documents, setting both flags to `false`.

## Usage
1. Ensure `node-cron` is installed (`npm install node-cron`).
2. Run the script with:
   ```bash
   npx ts-node src/scripts/updateClientFlags.ts
   ```
   or add a script to your `package.json` for easier execution.

## Note
- The cron job will only run while this script is running. For persistent scheduling, run it as a background process or integrate the logic into your main server if desired.
