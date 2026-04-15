/* ═══════════════════════════════════════════════════════
   Car Auctions — Catalog-available page module
   Depends on: data.js, filter.js
   ═══════════════════════════════════════════════════════ */

window.CatalogAvailablePage = {
  init: function() {
    loadData('data/parser/cars_transit.json', 'parser')
      .then(function(data) {
        initFilter({ data: data, source: 'parser' });
      })
      .catch(function(err) {
        console.error('[CatalogAvailablePage] Failed to load transit data:', err);
        var grid = document.getElementById('cars-grid');
        if (grid) grid.innerHTML = '<p style="padding:32px;color:#888">Не вдалося завантажити авто. Спробуйте пізніше.</p>';
      });
  }
};
