# MarineDocs Engineering Landing

MVP-лендинг для B2B-услуг в сфере судовой инженерной документации: калибровочные таблицы, обмеры, кренование, взвешивание, расчеты остойчивости и эксплуатационные документы.

## Запуск

```bash
npm.cmd install
npm.cmd run dev
```

`npm.cmd run dev` запускает Vite и локальный API для формы заявки. Production-режим:

```bash
npm.cmd run build
npm.cmd run start
```

## Где менять данные

- Контакты, услуги, FAQ и тексты: `src/data/siteContent.js`
- Главная структура компонентов: `src/App.jsx`
- Визуальный стиль: `src/styles.css`
- SEO title/description: `index.html`
- Яндекс.Метрика: слот для счетчика оставлен в `index.html`
- Hero-изображение: `public/images/marine-engineering-hero.png`
- Сервер приема заявок: `server/index.mjs`

## Форма заявки

Форма отправляет заявку на `/api/lead`, сервер валидирует данные и пересылает сообщение в Telegram через Bot API. Если сервер не настроен или Telegram недоступен, интерфейс показывает fallback-ссылку на заполненное письмо.

Нужные переменные окружения:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_THREAD_ID=
LEAD_SOURCE_LABEL=MarineDocs Engineering
```

`TELEGRAM_THREAD_ID` нужен только для темы в Telegram-группе. Пример без секретов лежит в `.env.example`; реальные значения не коммитить.
