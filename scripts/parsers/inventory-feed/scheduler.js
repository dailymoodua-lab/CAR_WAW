'use strict';

const config = require('./config');
const { runSync } = require('./run');

async function schedulerEntry() {
  console.log(`[inventory] scheduler entry, configured cron: ${config.schedule} (${config.timezone})`);
  return runSync();
}

if (require.main === module) {
  schedulerEntry().catch((error) => {
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  });
}

module.exports = {
  schedulerEntry
};
