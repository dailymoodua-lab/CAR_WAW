/* ═══════════════════════════════════════════════════════
   Car Auctions — Catalog page module
   Depends on: data.js, filter.js
   ═══════════════════════════════════════════════════════ */

window.CatalogPage = {
  init: function() {
    loadData('data/api/cars_catalog.json', 'api')
      .then(function(data) {
        initFilter({ data: data, source: 'api' });
      })
      .catch(function(err) {
        console.error('[CatalogPage] Failed to load catalog data:', err);
        var grid = document.getElementById('cars-grid');
        if (grid) grid.innerHTML = '<p style="padding:32px;color:#888">Не вдалося завантажити авто. Спробуйте пізніше.</p>';
      });
  }
};
