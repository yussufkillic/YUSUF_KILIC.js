(function() {
  // if the code blocks are not on the homepage, we write a message to the console 'wrong page'
  if (window.location.pathname !== "/") {
    console.log("wrong page");
    return;
  }

  var PRODUCT_URL = 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json';
  var LS_KEY = 'carousel_products';
  var LS_FAV_KEY = 'carousel_favorites';
  var products = [];
  var favorites = [];

  // 2. store favourite products in the localStorage 
  function loadFavorites() {
    try {
      favorites = JSON.parse(localStorage.getItem(LS_FAV_KEY)) || [];
    } catch(e) { favorites = []; }
  }
  function saveFavorites() {
    localStorage.setItem(LS_FAV_KEY, JSON.stringify(favorites));
  }
  function isFavorite(id) {
    return favorites.includes(id);
  }
  function toggleFavorite(id) {
    if (isFavorite(id)) {
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
    }
    saveFavorites();
    renderProducts();
  }

  // SVG 'heart icon'
  function getHeartSVG() {

    return `<svg class="carousel-heart-svg" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="carousel-heart-circle" cx="16" cy="16" r="15" fill="#fff" stroke="#fff" stroke-width="2"/>
      <path class="carousel-heart-path" d="M16 23.5s-6-4.7-6-9.1c0-2.6 2-4.4 4-4.4 1.2 0 2.3.7 3 1.7.7-1 1.8-1.7 3-1.7 2 0 4 1.8 4 4.4 0 4.4-6 9.1-6 9.1z" fill="#fff" stroke="#FFA500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // load products from localStorage or shared data source
  function loadProducts(cb) {
    var ls = localStorage.getItem(LS_KEY);
    if (ls) {
      try {
        products = JSON.parse(ls);
        return cb();
      } catch(e) {}
    }
    fetch(PRODUCT_URL)
      .then(r => r.json())
      .then(data => {
        products = data;
        localStorage.setItem(LS_KEY, JSON.stringify(products));
        cb();
      });
  }

  // 4. Create the carousel HTML and CSS
  function buildCarousel() {
    // CSS
    var css = `
    .carousel-ebebek-outer-wrapper { position: relative; width: 100%; max-width: 1160px; margin: 40px auto; }
    .carousel-ebebek-title-wrapper { width: 100%; display: flex; justify-content: flex-start; }
    .carousel-ebebek-title { font-family: Quicksand-Bold, Helvetica, sans-serif; font-size: 3rem; font-weight: 1000; color: #f28e00; background: #fff6e7; border-radius: 35px; padding: 18px 22px 0 80px; margin: 48px 0 24px 0px; display: flex; align-items: center; min-height: 70px; box-shadow: 0 2px 8px #e09c2b22; letter-spacing: 0.01em; line-height: 1.11; }
    .carousel-ebebek-container { background: #fff; border-radius: 24px; box-shadow: 0 4px 32px #0001; padding: 32px 24px 32px 24px; position: relative; overflow: visible !important; }
    .carousel-ebebek-list-wrapper { display: flex; align-items: center; position: relative; width: 100%; }
    .carousel-ebebek-arrow-abs { position: absolute; top: 50%; transform: translateY(-50%); z-index: 20; width: 48px; height: 48px; background: #fff; border-radius: 50%; box-shadow: 0 2px 8px #e09c2b33; border: 2px solid #ffe0b2; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #e09c2b; cursor: pointer; transition: background .2s, box-shadow .2s; }
    .carousel-ebebek-arrow-abs.left { left: 0; }
    .carousel-ebebek-arrow-abs.right { right: 0; }
    .carousel-ebebek-arrow-abs:active { background: #fff3e0; box-shadow: 0 2px 16px #e09c2b33; }
    @media (max-width: 900px) { .carousel-ebebek-arrow-abs.left { left: 0; } .carousel-ebebek-arrow-abs.right { right: 0; } }
    @media (max-width: 600px) { .carousel-ebebek-arrow-abs { display: none !important; } }
    .carousel-ebebek-list { display: flex !important; flex-wrap: nowrap !important; white-space: nowrap !important; overflow-x: hidden !important; gap: 24px !important; padding: 0 !important; flex: 1 1 auto !important; }
    .carousel-ebebek-list::-webkit-scrollbar { display: none !important; }
    .carousel-ebebek-list { -ms-overflow-style: none !important; scrollbar-width: none !important; }
    .carousel-ebebek-card { 
      display: flex !important; flex-direction: column !important; align-items: center !important; flex: 0 0 23.5%; min-width: 0; max-width: 100%; 
      background: #fff; border-radius: 6px; 
      box-shadow: 0 2px 16px #e09c2b22; 
      padding: 20px 16px 20px 16px; position: relative; 
      transition: box-shadow .2s, transform .2s, border-color .2s; 
      overflow: hidden !important; cursor: pointer; margin: 0;
      border: 2px solid rgba(224,224,224,0.6) !important;
    }
    .carousel-ebebek-card:hover {
      box-shadow: 0 8px 32px #e09c2b33; 
      transform: translateY(-4px) scale(1.03);
      border-color: #f2ae00 !important;
    }
    .carousel-ebebek-img { width: 140px; height: 140px; object-fit: contain; margin-bottom: 16px; border-radius: 12px; background: #fff7ed; }
    .carousel-ebebek-brand { font-size: 2rem; color: #e09c2b; font-weight: 800; margin-bottom: 4px; text-align: center; }
    .carousel-ebebek-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: rgb(64, 64, 64);
      text-align: center;
      margin-bottom: 10px;
      min-height: 44px;
      max-height: 44px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      word-break: break-word;
    }
    .carousel-ebebek-price, .carousel-ebebek-price.discounted {
      font-size: 2.2rem;
      font-weight: bold;
      color: #444;
    }
    .carousel-ebebek-original {
      font-size: 2rem;
      color: #888;
      text-decoration: line-through;
      margin-left: 8px;
    }
    .carousel-ebebek-discount, .carousel-ebebek-price.discounted {
      font-size: 1.3rem;
      color: #1bb934 !important;
      background: #e9fbe7;
      border-radius: 8px;
      padding: 2px 8px;
      margin-left: 8px;
      font-weight: bold;
    }
    .carousel-ebebek-price.discounted {
      background: none;
      padding: 0;
      margin-left: 0;
    }
    .carousel-ebebek-heart { position: absolute; top: 18px; right: 22px; cursor: pointer; font-size: 1.7rem; transition: color .2s; color: #ddd; }
    .carousel-ebebek-heart.filled .carousel-heart-svg .carousel-heart-path { fill: #FFA500 !important; stroke: #FFA500 !important; }
    .carousel-ebebek-heart.filled .carousel-heart-svg .carousel-heart-circle { stroke: #FFA500 !important; }
    .carousel-ebebek-heart:hover .carousel-heart-svg .carousel-heart-path { fill: #FFA500 !important; stroke: #FFA500 !important; }
    .carousel-ebebek-heart:hover .carousel-heart-svg .carousel-heart-circle { stroke: #fff !important; }
    @media (max-width: 600px) { .carousel-ebebek-heart { width: 32px; height: 32px; font-size: 1.3rem; } }
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    
    var outer = document.createElement('div');
    outer.className = 'carousel-ebebek-outer-wrapper';
    
    var titleWrapper = document.createElement('div');
    titleWrapper.className = 'carousel-ebebek-title-wrapper';
    var title = document.createElement('div');
    title.className = 'carousel-ebebek-title';
    title.textContent = 'Beğenebileceğinizi düşündüklerimiz';
    titleWrapper.appendChild(title);
    outer.appendChild(titleWrapper);
    
    var container = document.createElement('div');
    container.className = 'carousel-ebebek-container';
  
    var leftBtn = document.createElement('button');
    leftBtn.className = 'carousel-ebebek-arrow-abs left';
    leftBtn.innerHTML = '&#8592;';
    leftBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var list = container.querySelector('.carousel-ebebek-list');
      if (list) list.scrollBy({ left: -256, behavior: 'smooth' });
    });
    var rightBtn = document.createElement('button');
    rightBtn.className = 'carousel-ebebek-arrow-abs right';
    rightBtn.innerHTML = '&#8594;';
    rightBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var list = container.querySelector('.carousel-ebebek-list');
      if (list) list.scrollBy({ left: 256, behavior: 'smooth' });
    });
    container.appendChild(leftBtn);
    container.appendChild(rightBtn);
    var wrapper = document.createElement('div');
    wrapper.className = 'carousel-ebebek-list-wrapper';
    var list = document.createElement('div');
    list.className = 'carousel-ebebek-list';
    wrapper.appendChild(list);
    container.appendChild(wrapper);
    outer.appendChild(container);
    return outer;
  }

  // render products in the carousel 
  function renderProducts() {
    var list = document.querySelector('.carousel-ebebek-list');
    if (!list) return;
    list.innerHTML = '';
    products.forEach(function(p) {
      var isFav = isFavorite(p.id);
      var discount = (p.original_price > p.price) ? (p.original_price - p.price) : 0;
      var card = document.createElement('div');
      card.className = 'carousel-ebebek-card';

      var img = document.createElement('img');
      img.className = 'carousel-ebebek-img';
      img.src = p.img;
      img.alt = p.name;
      card.appendChild(img);

      var brand = document.createElement('div');
      brand.className = 'carousel-ebebek-brand';
      brand.textContent = p.brand;
      card.appendChild(brand);

      var name = document.createElement('div');
      name.className = 'carousel-ebebek-name';
      name.textContent = p.name;
      card.appendChild(name);

      var priceDiv = document.createElement('div');
      priceDiv.style.marginBottom = '8px';
      var priceHtml = '';
      if (discount > 0) {
        var percent = Math.round(100 * (p.original_price - p.price) / p.original_price);
        priceHtml += '<span class="carousel-ebebek-price discounted">'+p.price.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})+' TL</span>';
        priceHtml += '<span class="carousel-ebebek-original">'+p.original_price.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})+' TL</span>';
        priceHtml += '<span class="carousel-ebebek-discount">-%'+percent+'</span>';
      } else {
        priceHtml += '<span class="carousel-ebebek-price">'+p.price.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})+' TL</span>';
      }
      priceDiv.innerHTML = priceHtml;
      card.appendChild(priceDiv);

      var heart = document.createElement('span');
      heart.className = 'carousel-ebebek-heart' + (isFav ? ' filled' : '');
      heart.innerHTML = getHeartSVG();
      heart.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFavorite(p.id);
      });
      card.appendChild(heart);

      card.addEventListener('click', function() {
        window.open(p.url, '_blank');
      });

      list.appendChild(card);
    });
  }

  // Insert the carousel under the 'ins-stories' element
  function insertCarousel() {
    var stories = document.querySelector('.ins-stories');
    if (stories) {
      var carousel = buildCarousel();
      stories.parentNode.insertBefore(carousel, stories.nextSibling);
      renderProducts();
    }
  }

  // Starting point 
  loadFavorites();
  loadProducts(function() {
    insertCarousel();
  });
})();
  