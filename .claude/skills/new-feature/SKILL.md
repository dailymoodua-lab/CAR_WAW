---
name: new-feature
description: Add a new feature to the CarAuction website. Use this skill whenever the user says "добавь", "сделай", "хочу чтобы", "new feature", "новая функция", "добавить раздел", or describes something new they want on the site. Ensures all new code follows CarAuction project conventions automatically.
---

# New Feature — CarAuction

Добавление нового функционала на сайт Car Auctions с соблюдением всех правил проекта.

## Рабочая папка
`/Users/sergeybelskiy/Desktop/CarAuction/`

## Правила проекта (ВСЕГДА соблюдать)
- **Стек:** чистый HTML + CSS + JavaScript. Никаких React, Vue, Angular.
- **Сборщики:** не используем. Файлы работают напрямую в браузере.
- **Шрифт:** Inter (уже подключён через Google Fonts)
- **Цвета:** оранжевый акцент `#FF5C00`, hover `#FF7A2F`, тёмно-синий `#1B2A4A`
- **Язык:** украинский (uk)
- **Стиль:** светлый фон, корпоративный дизайн, без glassmorphism
- **car.html** — критический файл, менять только при необходимости

## Шаги

1. **Уточни задачу** — спроси пользователя:
   - Что именно нужно добавить?
   - На какую страницу? (index / catalog / car / blog / catalog-available)
   - Есть ли референс или описание как это должно выглядеть?

2. **Прочитай нужные файлы** — перед изменениями прочитай файл страницы чтобы понять контекст

3. **Реализуй** — добавь функционал следуя правилам выше:
   - Вписывай CSS прямо в `<style>` тега файла (не создавай отдельные CSS файлы без необходимости)
   - JS добавляй в конец файла перед `</body>`
   - Используй существующие CSS-переменные (`--orange`, `--navy`, etc.)

4. **Проверь** — убедись что:
   - Верстка адаптивна (mobile-first)
   - Цвета соответствуют дизайну
   - Текст на украинском

5. **Предложи деплой** — спроси: "Задеплоить изменения на leechan.xyz?"

## CSS-переменные проекта
```css
--orange:  #FF5C00
--orange2: #FF7A2F
--navy:    #1B2A4A
--light:   #F5F6FA
--border:  #E4E7EF
--text:    #1a2236
--text2:   #5a6478
--text3:   #9aa3b8
```

## Типичные компоненты (переиспользуй стиль)
- Кнопка: `class="btn-ora"` — оранжевая, border-radius 8px
- Карточка: белый фон, border 1px solid var(--border), border-radius 12px
- Заголовок секции: font-weight 700, color var(--text)
