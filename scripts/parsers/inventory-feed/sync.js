'use strict';

const { AVAILABILITY, INTERNAL_STATUS } = require('./types');

function getRecordKey(item) {
  return String(item.externalId || item.vin || item.sourceUrl || item.id || '');
}

function sortRecords(records) {
  return [...records].sort((left, right) => {
    const leftScore = left.isActive === false ? 1 : 0;
    const rightScore = right.isActive === false ? 1 : 0;
    if (leftScore !== rightScore) return leftScore - rightScore;
    const priceDiff = Number(right.price || 0) - Number(left.price || 0);
    if (priceDiff !== 0) return priceDiff;
    return String(left.title || '').localeCompare(String(right.title || ''), 'uk');
  });
}

function syncNormalizedItems(incomingRecords, previousRecords, config) {
  const now = new Date().toISOString();
  const previousSourceRecords = (previousRecords || []).filter(item => String(item.sourceVendor || '').toLowerCase() === config.sourceVendor.toLowerCase());
  const previousMap = new Map(previousSourceRecords.map(item => [getRecordKey(item), item]));
  const seenKeys = new Set();
  const mergedSourceRecords = [];

  for (const incoming of incomingRecords) {
    const key = getRecordKey(incoming);
    const previous = previousMap.get(key);
    seenKeys.add(key);
    mergedSourceRecords.push({
      ...previous,
      ...incoming,
      firstSeenAt: previous && previous.firstSeenAt ? previous.firstSeenAt : (incoming.firstSeenAt || now),
      lastSeenAt: incoming.lastSeenAt || now,
      missingSince: null,
      missingRunCount: 0,
      status: INTERNAL_STATUS.IN_TRANSIT,
      availability: AVAILABILITY.AVAILABLE,
      isActive: true
    });
  }

  const previousActiveCount = previousSourceRecords.filter(item => item.isActive !== false).length;
  const suspicious = previousActiveCount > 0 && incomingRecords.length < Math.ceil(previousActiveCount * config.sync.minimumResultRatio);

  for (const previous of previousSourceRecords) {
    const key = getRecordKey(previous);
    if (seenKeys.has(key)) continue;

    if (suspicious) {
      mergedSourceRecords.push(previous);
      continue;
    }

    const nextMissCount = Number(previous.missingRunCount || 0) + 1;
    const isActive = nextMissCount < config.sync.deactivateAfterMisses;

    mergedSourceRecords.push({
      ...previous,
      missingSince: previous.missingSince || now,
      missingRunCount: nextMissCount,
      isActive,
      status: isActive ? (previous.status || INTERNAL_STATUS.IN_TRANSIT) : INTERNAL_STATUS.ARCHIVED,
      availability: isActive ? (previous.availability || AVAILABILITY.AVAILABLE) : AVAILABILITY.UNAVAILABLE
    });
  }

  return {
    suspicious,
    sourceRecords: sortRecords(mergedSourceRecords)
  };
}

module.exports = {
  syncNormalizedItems
};
