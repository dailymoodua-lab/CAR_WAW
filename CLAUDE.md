# Car Auctions — Project Instructions for Claude

## Рабочая папка
`/Users/sergeybelskiy/Desktop/CarAuction/` — это **единственная папка для правок**.
Не трогать другие папки на Desktop (особенно `AI CENTR/ECOFACTOR AUTO/`).

## Что это за проект
Сайт **Car Auctions** — импорт авто из США, Китая и Европы.
Язык: украинский (uk).
Деплой: GitHub Pages → https://leechan.xyz
Репозиторий: https://github.com/Luichakr/leechanauto

## Технологии
- Чистый HTML + CSS + JavaScript (без фреймворков)
- Шрифт: Inter (Google Fonts)
- Без сборщиков (webpack/vite) — файлы открываются напрямую в браузере
- Деплой: `git push origin main` → автоматически на leechan.xyz

## Design Tokens (цвета)
```
--orange:  #FF5C00   ← главный акцент
--orange2: #FF7A2F   ← hover состояние
--navy:    #1B2A4A   ← тёмно-синий
--light:   #F5F6FA   ← светлый фон
--border:  #E4E7EF
--text:    #1a2236   ← основной текст
--text2:   #5a6478   ← второстепенный текст
--text3:   #9aa3b8   ← слабый текст
```

## Файлы проекта
```
index.html              ← главная страница
catalog.html            ← каталог авто
catalog-available.html  ← авто в дороге
car.html                ← карточка авто (КРИТИЧЕСКИЙ файл — осторожно!)
blog.html               ← блог
auth-modal.css/js       ← модальное окно входа
mobile-nav.css/js       ← мобильная навигация
shared-filter-engine.js ← логика фильтров
data/                   ← JSON данные об авто
images/                 ← фото авто и ассеты
```

## API
- URL: https://auto.ecofactor.ua
- Key: eco_dae2c8f67505028dd8eb15477aa4f40994041ac717999b66
- Endpoint: /api/v1/vehicles/{lotId}
- Используется в car.html для загрузки данных об авто

## Критические правила
1. `car.html` — содержит сложную логику (LOCAL_CARS, VIN-роутинг, API). Менять осторожно.
2. `images/local/{VIN}/` — НЕ перемещать, привязаны к VIN-кодам.
3. После правок — обязательно `git push origin main` для деплоя.
4. НЕ добавлять фреймворки (React, Vue, etc.).
5. НЕ добавлять сборщики — сайт работает без npm build.

## Git workflow
```bash
git add <файлы>
git commit -m "fix: описание"
git push origin main
```

## Цели проекта (текущие)
- Сайт работающий, красивый, быстрый
- Мобильная версия адаптивная
- Каталог подключён к реальному API
- Фильтры работают корректно

## Обязательный контекст перед работой
- Сначала читать `MEMORY.md`
- Затем читать `ARCHITECTURE.md`
- Для клиентского контекста смотреть `CLIENT.md`
- После значимых изменений фиксировать короткую запись в `ACTIONS_LOG.md`
