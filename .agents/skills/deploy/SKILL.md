---
name: deploy
description: Deploy CarAuction site to leechan.xyz. Use this skill whenever the user says "задеплой", "деплой", "выложи на сайт", "пуш", "deploy", "push to site", "опубликуй", or wants to publish changes to the live website. Always use this skill before finishing any work session on the CarAuction project.
---

# Deploy — CarAuction

Деплой сайта Car Auctions на leechan.xyz через GitHub Pages.

## Рабочая папка
`/Users/sergeybelskiy/Desktop/CarAuction/`

## Шаги

1. Перейди в папку `/Users/sergeybelskiy/Desktop/CarAuction/`
2. Выполни `git status` — покажи пользователю какие файлы изменились
3. Спроси краткое описание для коммита (или предложи автоматическое на основе изменений)
4. Выполни:
   ```bash
   git add -A
   git commit -m "update: <описание>"
   git push origin main
   ```
5. Сообщи что деплой завершён и сайт обновится на leechan.xyz в течение ~1 минуты

## Формат сообщения после деплоя
```
Задеплоено успешно.
Коммит: "update: <описание>"
Сайт обновится на leechan.xyz через ~1 минуту.
```

## Важно
- Всегда показывай список изменённых файлов перед коммитом
- Если ничего не изменилось — сообщи об этом
- Никогда не делай force push
