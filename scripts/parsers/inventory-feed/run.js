'use strict';

const config = require('./config');
const { fetchAllListingCards } = require('./fetchListing');
const { fetchCardDetails } = require('./fetchCard');
const { normalizeRawRecords } = require('./normalize');
const { syncNormalizedItems } = require('./sync');
const { exportFrontendArtifacts } = require('./exportFrontend');
const { appendLog, createHtmlClient, mapLimit, readJson } = require('./utils');

async function runSync() {
  const client = await createHtmlClient(config);
  const startedAt = new Date().toISOString();

  try {
    console.log(`[inventory] sync started at ${startedAt} using ${client.mode}`);

    const listingResult = await fetchAllListingCards(config, client);
    console.log(`[inventory] listing pages: ${listingResult.pages.length}, cards: ${listingResult.cards.length}, detected total pages: ${listingResult.totalPagesDetected}`);

    const rawRecords = await mapLimit(listingResult.cards, config.runtime.concurrency, async (card) => {
      return fetchCardDetails(card, config, client);
    });

    const normalizedRecords = await normalizeRawRecords(rawRecords, config);
    const previousNormalized = await readJson(config.output.normalizedFile, []);
    const syncResult = syncNormalizedItems(normalizedRecords, previousNormalized, config);
    const exportResult = await exportFrontendArtifacts(rawRecords, syncResult, config);

    const summary = {
      startedAt,
      finishedAt: new Date().toISOString(),
      clientMode: client.mode,
      listingPagesFetched: listingResult.pages.length,
      listingCardsFound: listingResult.cards.length,
      rawRecords: rawRecords.length,
      normalizedRecords: normalizedRecords.length,
      activeSourceRecords: syncResult.sourceRecords.filter(item => item.isActive !== false).length,
      suspiciousSync: syncResult.suspicious,
      wroteFrontendFile: exportResult.wroteFrontendFile,
      frontendSourceCount: exportResult.frontendSourceCount,
      mergedCount: exportResult.mergedCount
    };

    console.log('[inventory] summary');
    console.log(JSON.stringify(summary, null, 2));
    await appendLog(config.output.logFile, JSON.stringify(summary));
    return summary;
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  runSync().catch(async (error) => {
    console.error('[inventory] sync failed');
    console.error(error && error.stack ? error.stack : error);
    try {
      await appendLog(config.output.logFile, JSON.stringify({
        failedAt: new Date().toISOString(),
        error: error && error.message ? error.message : String(error)
      }));
    } catch (logError) {
      console.error('[inventory] failed to write log', logError);
    }
    process.exitCode = 1;
  });
}

module.exports = {
  runSync
};
