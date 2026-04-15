'use strict';

const INTERNAL_STATUS = Object.freeze({
  IN_TRANSIT: 'in_transit',
  ACTIVE: 'active',
  ARCHIVED: 'archived'
});

const AVAILABILITY = Object.freeze({
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable'
});

module.exports = {
  INTERNAL_STATUS,
  AVAILABILITY
};
