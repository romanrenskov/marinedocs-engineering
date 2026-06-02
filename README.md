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

Форма отправляет заявку на `/api/lead`, сервер валидирует данные и пересылает JSON в n8n Webhook. Дальше n8n сам записывает заявку в Google Sheets и отправляет сообщение в Telegram. Если сервер не настроен или n8n недоступен, интерфейс показывает fallback-ссылку на заполненное письмо.

Нужные переменные окружения:

```bash
N8N_WEBHOOK_URL=
LEAD_SOURCE_LABEL=MarineDocs Engineering
```

`N8N_WEBHOOK_URL` - Production URL из Webhook node в n8n. Пример без секретов лежит в `.env.example`; реальные значения не коммитить.

JSON, который получает n8n:

```json
{
  "source": "MarineDocs Engineering",
  "receivedAt": "2026-06-02T12:00:00.000Z",
  "pageUrl": "https://example.com",
  "name": "",
  "company": "",
  "phone": "",
  "messenger": "",
  "email": "",
  "vesselType": "",
  "taskType": "",
  "comment": "",
  "consent": true,
  "website": ""
}
```
