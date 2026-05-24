import { useMemo, useState } from "react";
import {
  Anchor,
  ArrowRight,
  BadgeCheck,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Mail,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Ruler,
  Scale,
  Send,
  Ship,
  X,
} from "lucide-react";
import {
  audiences,
  contacts,
  estimateRequirements,
  faq,
  heroServices,
  privacyText,
  problemPoints,
  services,
  taskExamples,
  workflow,
} from "./data/siteContent";

const serviceIcons = [Calculator, Ruler, Anchor, Scale, Ship, FileText, Navigation];

const initialLeadForm = {
  name: "",
  company: "",
  phone: "",
  messenger: "",
  email: "",
  vesselType: "",
  taskType: "Расчеты остойчивости",
  comment: "",
  consent: false,
  website: "",
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const navItems = [
    ["Для кого", "#audience"],
    ["Задачи", "#tasks"],
    ["Услуги", "#services"],
    ["Процесс", "#workflow"],
    ["FAQ", "#faq"],
    ["Контакты", "#contact"],
  ];

  return (
    <>
      <div className="site-shell">
        <Header
          navItems={navItems}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen((value) => !value)}
          onCloseMenu={() => setIsMenuOpen(false)}
        />

        <main>
          <Hero />
          <Audience />
          <Tasks />
          <Services />
          <Workflow />
          <Estimate />
          <Examples />
          <Faq />
          <Contact onOpenPrivacy={() => setIsPrivacyOpen(true)} />
        </main>

        <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      </div>

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
}

function Header({ navItems, isMenuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className="header">
      <a className="brand" href="#top" onClick={onCloseMenu} aria-label="MarineDocs Engineering">
        <span className="brand-mark">MD</span>
        <span>
          <strong>MarineDocs</strong>
          <small>Engineering</small>
        </span>
      </a>

      <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`} aria-label="Основная навигация">
        {navItems.map(([label, href]) => (
          <a key={href} href={href} onClick={onCloseMenu}>
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <a className="icon-button" href={contacts.telegramUrl} aria-label="Написать в Telegram">
          <MessageCircle size={19} />
        </a>
        <a className="button button-small" href="#contact">
          <Send size={17} />
          Заявка
        </a>
        <button className="menu-button" type="button" onClick={onToggleMenu} aria-label="Открыть меню">
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy">
          <div className="eyebrow">
            <BadgeCheck size={18} />
            <span>Строгий инженерный подход для B2B-флота</span>
          </div>
          <h1>Документация и расчеты для флота</h1>
          <p className="hero-lead">
            Калибровочные таблицы, обмеры, кренование, взвешивание и расчеты
            остойчивости для судовладельцев и операторов флота.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              <Send size={19} />
              Получить консультацию
            </a>
            <a className="button button-secondary" href="#estimate">
              <Calculator size={19} />
              Рассчитать стоимость
            </a>
          </div>

          <div className="location-line">
            <span>Санкт-Петербург</span>
            <span>Работаем по России</span>
            <span>Возможны выезды на судно</span>
          </div>
        </div>

        <div className="hero-panel" aria-label="Основные направления">
          <span className="panel-kicker">Основные работы</span>
          {heroServices.map((item) => (
            <div className="hero-service" key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </div>
          ))}
          <div className="status-note">
            <span>Статус РМРС / аккредитация</span>
            <strong>будет добавлен после подтверждения</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ kicker, title, text }) {
  return (
    <div className="section-heading">
      <span>{kicker}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function Audience() {
  return (
    <section className="section" id="audience">
      <SectionHeading
        kicker="Для кого"
        title="Сайт говорит с техническими людьми"
        text="Фокус на задачах судовладельца, эксплуатации, документации и проверяемых инженерных материалах."
      />
      <div className="audience-grid">
        {audiences.map((item) => (
          <div className="compact-card" key={item}>
            <Ship size={20} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tasks() {
  return (
    <section className="section split-section" id="tasks">
      <div>
        <SectionHeading
          kicker="Какие задачи закрываем"
          title="От разрозненных данных к комплекту документов"
          text="Готовим техническую документацию в корректном виде и сопровождаем замечания в рамках согласованного объема работ."
        />
        <a className="text-link" href="#contact">
          Обсудить задачу <ArrowRight size={17} />
        </a>
      </div>
      <div className="problem-list">
        {problemPoints.map((point) => (
          <div className="problem-item" key={point}>
            <CheckCircle2 size={19} />
            <p>{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section" id="services">
      <SectionHeading
        kicker="Услуги"
        title="Инженерная документация, измерения и расчеты"
        text="Без агрессивных обещаний: состав работ определяется по судну, исходным данным и требованиям к итоговому комплекту."
      />
      <div className="services-grid">
        {services.map((service, index) => {
          const Icon = serviceIcons[index] ?? FileText;
          return (
            <article className="service-card" key={service.title}>
              <div className="service-icon">
                <Icon size={24} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section className="section split-section" id="workflow">
      <div>
        <SectionHeading
          kicker="Как работаем"
          title="Понятный B2B-процесс без лишней суеты"
          text="Сначала фиксируем задачу и исходные данные, затем согласовываем объем, сроки и формат результата."
        />
      </div>
      <ol className="timeline">
        {workflow.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Estimate() {
  return (
    <section className="section estimate-band" id="estimate">
      <div className="estimate-copy">
        <SectionHeading
          kicker="Что нужно для оценки"
          title="Предварительная оценка обычно возможна за 1 рабочий день"
          text="Стоимость зависит от типа судна, количества объектов, качества исходных данных, выезда, срочности и требований к комплекту документов."
        />
      </div>
      <div className="requirements-grid">
        {estimateRequirements.map((item) => (
          <div key={item}>
            <ClipboardCheck size={19} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Examples() {
  return (
    <section className="section" id="examples">
      <SectionHeading
        kicker="Примеры задач"
        title="Работаем с типовыми сценариями эксплуатации и проверки"
        text="Блок без фейковых отзывов: реальные кейсы можно добавить после публикации и согласования материалов."
      />
      <div className="examples-grid">
        {taskExamples.map((item) => (
          <div className="example-card" key={item}>
            <Anchor size={19} />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section" id="faq">
      <SectionHeading
        kicker="FAQ"
        title="Коротко о частых вопросах"
        text="Формулировки оставлены осторожными: без неподтвержденных обещаний про официальные статусы и гарантии принятия."
      />
      <div className="faq-list">
        {faq.map((item) => (
          <details key={item.question}>
            <summary>
              <span>{item.question}</span>
              <ChevronDown size={20} />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Contact({ onOpenPrivacy }) {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-copy">
        <SectionHeading
          kicker="Заявка"
          title="Опишите задачу — оценим объем, сроки и стоимость"
          text="Можно отправить краткое описание, тип судна и контакт для связи. Исходные документы запросим после первичного контакта."
        />

        <div className="contact-actions" aria-label="Контакты">
          <a href={`tel:${contacts.phone}`}>
            <Phone size={19} />
            {contacts.phoneLabel}
          </a>
          <a href={`mailto:${contacts.email}`}>
            <Mail size={19} />
            {contacts.email}
          </a>
          <a href={contacts.telegramUrl}>
            <MessageCircle size={19} />
            {contacts.telegram}
          </a>
          <a href={contacts.whatsappUrl}>
            <MessageCircle size={19} />
            WhatsApp
          </a>
        </div>

        <div className="legal-card">
          <span>Юридическая информация</span>
          <strong>{contacts.legal}</strong>
          <p>{contacts.city}. {contacts.geography}.</p>
        </div>
      </div>

      <LeadForm onOpenPrivacy={onOpenPrivacy} />
    </section>
  );
}

function LeadForm({ onOpenPrivacy }) {
  const [form, setForm] = useState(initialLeadForm);
  const [status, setStatus] = useState(null);
  const [fallbackHref, setFallbackHref] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskOptions = useMemo(
    () => [
      "Расчеты остойчивости",
      "Кренование / взвешивание",
      "Калибровочные таблицы",
      "Эксплуатационная документация и планы",
      "Обмеры цистерн / конструкций",
      "Другая задача",
    ],
    [],
  );

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function submitForm(event) {
    event.preventDefault();

    const hasContact = form.phone.trim() || form.messenger.trim() || form.email.trim();
    setFallbackHref("");

    if (!hasContact) {
      setStatus({
        type: "error",
        message: "Укажите телефон, email или Telegram/WhatsApp для обратной связи.",
      });
      return;
    }

    if (!form.consent) {
      setStatus({ type: "error", message: "Нужно согласие на обработку персональных данных." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "pending", message: "Отправляем заявку." });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Не удалось отправить заявку автоматически.");
      }

      setStatus({
        type: "success",
        message: result.message || "Заявка отправлена. Мы свяжемся с вами по указанному контакту.",
      });
      setForm(initialLeadForm);
    } catch (error) {
      setFallbackHref(createLeadMailto(form));
      setStatus({
        type: "error",
        message: `${error.message} Можно открыть письмо с уже заполненной заявкой.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="lead-form" onSubmit={submitForm}>
      <div className="form-grid">
        <label>
          <span>Имя</span>
          <input name="name" value={form.name} onChange={updateField} autoComplete="name" maxLength="80" />
        </label>
        <label>
          <span>Компания</span>
          <input name="company" value={form.company} onChange={updateField} autoComplete="organization" maxLength="120" />
        </label>
        <label>
          <span>Телефон</span>
          <input name="phone" value={form.phone} onChange={updateField} autoComplete="tel" inputMode="tel" maxLength="60" />
        </label>
        <label>
          <span>Telegram / WhatsApp</span>
          <input
            name="messenger"
            value={form.messenger}
            onChange={updateField}
            placeholder="@username или номер"
            maxLength="80"
          />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" maxLength="120" />
        </label>
        <label>
          <span>Тип судна</span>
          <input
            name="vesselType"
            value={form.vesselType}
            onChange={updateField}
            placeholder="танкер, рабочее судно..."
            maxLength="120"
          />
        </label>
        <label className="full">
          <span>Какая задача нужна</span>
          <select name="taskType" value={form.taskType} onChange={updateField}>
            {taskOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="full">
          <span>Комментарий</span>
          <textarea
            name="comment"
            value={form.comment}
            onChange={updateField}
            rows="5"
            placeholder="Кратко опишите судно, задачу, сроки и какие исходные данные есть."
            maxLength="1800"
          />
        </label>
        <label className="hidden-field" aria-hidden="true">
          <span>Сайт</span>
          <input name="website" value={form.website} onChange={updateField} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="consent">
        <input name="consent" type="checkbox" checked={form.consent} onChange={updateField} />
        <span>
          Согласен на обработку персональных данных и принимаю{" "}
          <button type="button" onClick={onOpenPrivacy}>
            политику конфиденциальности
          </button>
        </span>
      </label>

      <button className="button button-primary form-submit" type="submit" disabled={isSubmitting}>
        <Send size={19} />
        {isSubmitting ? "Отправляем" : "Отправить заявку"}
      </button>
      {status ? (
        <div
          className={`form-status form-status-${status.type}`}
          role={status.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <p>{status.message}</p>
          {fallbackHref ? <a href={fallbackHref}>Открыть письмо</a> : null}
        </div>
      ) : null}
    </form>
  );
}

function createLeadMailto(form) {
  const subject = encodeURIComponent(`Заявка MarineDocs Engineering: ${form.taskType}`);
  const body = encodeURIComponent(
    [
      "Новая заявка с сайта MarineDocs Engineering",
      "",
      `Имя: ${form.name || "не указано"}`,
      `Компания: ${form.company || "не указано"}`,
      `Телефон: ${form.phone || "не указано"}`,
      `Telegram/WhatsApp: ${form.messenger || "не указано"}`,
      `Email: ${form.email || "не указано"}`,
      `Тип судна: ${form.vesselType || "не указано"}`,
      `Задача: ${form.taskType}`,
      "",
      "Комментарий:",
      form.comment || "не указано",
    ].join("\n"),
  );

  return `mailto:${contacts.email}?subject=${subject}&body=${body}`;
}

function Footer({ onOpenPrivacy }) {
  return (
    <footer className="footer">
      <div>
        <strong>MarineDocs Engineering</strong>
        <span>Документация, измерения и расчеты для флота.</span>
      </div>
      <button type="button" onClick={onOpenPrivacy}>
        Политика конфиденциальности
      </button>
    </footer>
  );
}

function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Политика конфиденциальности">
      <div className="modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть">
          <X size={22} />
        </button>
        <span className="modal-kicker">Обновлено: {privacyText.updated}</span>
        <h2>Политика конфиденциальности</h2>
        <p>
          {privacyText.company} обрабатывает персональные данные, которые пользователь
          добровольно передает через форму заявки, email, телефон, Telegram или WhatsApp.
        </p>
        <p>
          Данные используются для связи по обращению, предварительной оценки задачи,
          подготовки коммерческого предложения и дальнейшей коммуникации по работам.
        </p>
        <p>
          Могут обрабатываться имя, компания, телефон, адрес электронной почты, аккаунт
          мессенджера, сведения о судне, описание задачи и приложенные пользователем
          технические материалы.
        </p>
        <p>
          Данные не публикуются и не передаются третьим лицам, кроме случаев, когда это
          требуется для исполнения запроса пользователя, соблюдения закона или согласованных
          работ с подрядчиками и сервисами связи.
        </p>
        <p>
          Пользователь может запросить уточнение, удаление или прекращение обработки данных,
          направив обращение на {contacts.email}.
        </p>
      </div>
    </div>
  );
}

export default App;
