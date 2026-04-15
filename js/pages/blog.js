(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPageFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var page = parseInt(params.get('page') || '1', 10);
    return Number.isFinite(page) && page > 0 ? page : 1;
  }

  function getOrigin() {
    if (window.location && /^https?:/i.test(window.location.origin || '')) {
      return window.location.origin;
    }
    return 'https://leechan.xyz';
  }

  function toPostCard(post) {
    return '' +
      '<article class="post-card img-card horiz reveal">' +
        '<div class="post-card-img" style="width:240px;height:auto;flex-shrink:0">' +
          '<img src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(post.title) + '" loading="lazy" style="height:100%;min-height:170px;object-fit:cover" />' +
        '</div>' +
        '<div class="post-card-body">' +
          '<div class="post-meta">' +
            '<span class="post-tag tag-guide">' + escapeHtml(post.category) + '</span>' +
            '<span class="post-date">' + escapeHtml(post.date) + '</span>' +
            '<span class="post-read">' + escapeHtml(post.readTime) + '</span>' +
          '</div>' +
          '<div class="post-title">' + escapeHtml(post.title) + '</div>' +
          '<div class="post-excerpt">' + escapeHtml(post.excerpt) + '</div>' +
          '<div class="post-footer">' +
            '<div class="post-author">' +
              '<div class="author-avatar">' + escapeHtml((post.author || 'B').slice(0, 1).toUpperCase()) + '</div>' +
              '<span class="author-name">' + escapeHtml(post.author || 'BIDDER') + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function toTrendingItem(post, idx) {
    return '' +
      '<div class="trending-item">' +
        '<div class="trending-num">' + String(idx + 1).padStart(2, '0') + '</div>' +
        '<div>' +
          '<div class="trending-title">' + escapeHtml(post.title) + '</div>' +
          '<div class="trending-meta">' + escapeHtml(post.readTime) + ' · ' + (post.views || 0).toLocaleString('uk-UA') + ' переглядів</div>' +
        '</div>' +
      '</div>';
  }

  function syncSeo(page, totalPages, featuredPost) {
    var origin = getOrigin();
    var basePath = '/blog.html';
    var canonicalUrl = origin + basePath + (page > 1 ? ('?page=' + page) : '');

    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', canonicalUrl);

    document.querySelectorAll('link[rel="prev"], link[rel="next"]').forEach(function (el) { el.remove(); });

    if (page > 1) {
      var prev = document.createElement('link');
      prev.setAttribute('rel', 'prev');
      prev.setAttribute('href', origin + basePath + (page === 2 ? '' : ('?page=' + (page - 1))));
      document.head.appendChild(prev);
    }
    if (page < totalPages) {
      var next = document.createElement('link');
      next.setAttribute('rel', 'next');
      next.setAttribute('href', origin + basePath + '?page=' + (page + 1));
      document.head.appendChild(next);
    }

    var title = page > 1 ? ('Блог — сторінка ' + page + ' | BIDDER') : 'Блог — BIDDER';
    document.title = title;

    var description = page > 1
      ? ('Блог BIDDER — сторінка ' + page + '. Поради щодо імпорту авто, розмитнення та вибору лоту.')
      : 'Блог BIDDER — поради щодо імпорту авто, розмитнення та вибору лоту на аукціоні США та Європи.';

    var descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', description);

    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Блог BIDDER',
      url: canonicalUrl,
      description: description,
      inLanguage: 'uk',
      blogPost: featuredPost ? [{
        '@type': 'BlogPosting',
        headline: featuredPost.title,
        image: origin + '/' + String(featuredPost.image || '').replace(/^\/+/, ''),
        datePublished: featuredPost.date,
        author: {
          '@type': 'Person',
          name: featuredPost.author || 'BIDDER'
        }
      }] : []
    };

    var schemaEl = document.querySelector('script[type="application/ld+json"]');
    if (schemaEl) schemaEl.textContent = JSON.stringify(schema, null, 2);
  }

  function renderPagination(target, page, totalPages) {
    if (!target) return;
    if (totalPages <= 1) {
      target.innerHTML = '';
      target.style.display = 'none';
      return;
    }

    var html = '';
    html += '<button class="blog-page-btn" data-page="' + (page - 1) + '" ' + (page === 1 ? 'disabled' : '') + '>Назад</button>';
    for (var i = 1; i <= totalPages; i += 1) {
      html += '<button class="blog-page-btn ' + (i === page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    html += '<button class="blog-page-btn" data-page="' + (page + 1) + '" ' + (page === totalPages ? 'disabled' : '') + '>Далі</button>';

    target.innerHTML = html;
    target.style.display = 'flex';

    target.querySelectorAll('.blog-page-btn[data-page]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (!Number.isFinite(targetPage) || targetPage < 1 || targetPage > totalPages || targetPage === page) return;
        var nextUrl = targetPage === 1 ? 'blog.html' : ('blog.html?page=' + targetPage);
        window.location.href = nextUrl;
      });
    });
  }

  function renderBlog(posts) {
    var wrapper = document.querySelector('.page-wrapper');
    if (!wrapper) return;

    var perPage = 6;
    var page = getPageFromQuery();
    var featured = posts[0] || null;
    var feed = posts.slice(1);
    var totalPages = Math.max(1, Math.ceil(feed.length / perPage));
    if (page > totalPages) page = totalPages;

    var start = (page - 1) * perPage;
    var pagePosts = feed.slice(start, start + perPage);
    var trending = feed.slice().sort(function (a, b) { return (b.views || 0) - (a.views || 0); }).slice(0, 5);

    wrapper.innerHTML = '' +
      '<section class="blog-hero">' +
        '<img class="hero-img" src="' + escapeHtml(featured ? featured.image : 'images/96444975_HD_images/96444975_Image_1.jpg') + '" alt="' + escapeHtml(featured ? featured.title : 'Блог BIDDER') + '" />' +
        '<div class="hero-content">' +
          '<div class="hero-meta reveal">' +
            '<span class="post-tag tag-review">' + escapeHtml(featured ? featured.category : 'Блог') + '</span>' +
            '<span class="hero-date">' + escapeHtml(featured ? featured.date : '') + '</span>' +
            '<span class="hero-read">' + escapeHtml(featured ? featured.readTime : '') + '</span>' +
          '</div>' +
          '<h1 class="hero-title reveal" style="transition-delay:0.08s">' + escapeHtml(featured ? featured.title : 'Блог BIDDER') + '</h1>' +
          '<p class="hero-excerpt reveal" style="transition-delay:0.16s">' + escapeHtml(featured ? featured.excerpt : '') + '</p>' +
        '</div>' +
      '</section>' +
      '<div class="section">' +
        '<div class="section-header">' +
          '<div>' +
            '<div class="section-title reveal">Публікації</div>' +
            '<div class="section-subtitle reveal" style="transition-delay:0.06s">Єдиний стрічковий формат з JSON-джерела</div>' +
          '</div>' +
        '</div>' +
        '<div class="two-col-grid">' +
          '<div class="main-col" id="blogFeedMain"></div>' +
          '<div class="side-col">' +
            '<div class="side-widget reveal">' +
              '<div class="widget-title">Популярне</div>' +
              '<div class="trending-list" id="blogTrending"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<nav class="blog-pagination reveal" id="blogPagination" aria-label="Пагінація блогу"></nav>' +
      '</div>';

    var feedEl = document.getElementById('blogFeedMain');
    if (feedEl) {
      feedEl.innerHTML = pagePosts.map(toPostCard).join('');
    }

    var trendingEl = document.getElementById('blogTrending');
    if (trendingEl) {
      trendingEl.innerHTML = trending.map(toTrendingItem).join('');
    }

    renderPagination(document.getElementById('blogPagination'), page, totalPages);
    syncSeo(page, totalPages, featured);

    var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  async function init() {
    try {
      var response = await fetch('data/blog-posts.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('blog-data-fetch-failed');
      var posts = await response.json();
      if (!Array.isArray(posts) || !posts.length) throw new Error('blog-data-empty');
      renderBlog(posts);
    } catch (error) {
      console.error('[BlogPage] fallback to static html:', error);
    }
  }

  window.BlogPage = { init: init };
})();
