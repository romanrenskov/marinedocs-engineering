import { useEffect, useMemo, useState } from "react";
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

const initialBudgetCalculator = {
  tanks: 5,
  dataQuality: "drawings",
  objectReadiness: "ready",
  urgency: "standard",
  workFormat: "calculation",
  visitType: "remote",
};

const initialChecklistForm = {
  name: "",
  phone: "",
  email: "",
  vesselType: "",
  comment: "",
  consent: false,
  website: "",
};

const budgetCalculatorModel = {
  base: 80000,
  perTank: 10000,
  dataQuality: {
    drawings: { label: "Есть чертежи", cost: 0, factor: "" },
    partial: { label: "Есть частично", cost: 25000, factor: "Частичное наличие исходных данных" },
    none: { label: "Данных нет", cost: 50000, factor: "Отсутствие исходных данных" },
  },
  objectReadiness: {
    ready: { label: "Полностью готов", cost: 0, factor: "" },
    partial: { label: "Частично готов", cost: 30000, factor: "Объект частично готов к работам" },
    "not-ready": { label: "Не готов", cost: 60000, factor: "Объект не готов к работам" },
  },
  urgency: {
    standard: { label: "Стандартный срок", multiplier: 1, factor: "" },
    fast: { label: "Быстро", multiplier: 1.2, factor: "Ускоренные сроки выполнения" },
    "very-urgent": { label: "Очень срочно", multiplier: 1.4, factor: "Очень срочные сроки выполнения" },
  },
  workFormat: {
    calculation: { label: "Только расчет", cost: 0 },
    "calc-tables": { label: "Расчет + таблицы", cost: 40000 },
    "calc-tables-3d": { label: "Расчет + таблицы + 3D", cost: 80000 },
    "full-package": { label: "Полный комплект", cost: 120000 },
  },
  visitType: {
    remote: { label: "Удаленно", cost: 0 },
    spb: { label: "Санкт-Петербург", cost: 20000 },
    other: { label: "Другой регион", cost: 70000 },
  },
};

const calculatorOptionGroups = {
  dataQuality: Object.entries(budgetCalculatorModel.dataQuality).map(([value, item]) => ({ value, label: item.label })),
  objectReadiness: Object.entries(budgetCalculatorModel.objectReadiness).map(([value, item]) => ({
    value,
    label: item.label,
  })),
  urgency: Object.entries(budgetCalculatorModel.urgency).map(([value, item]) => ({ value, label: item.label })),
  workFormat: Object.entries(budgetCalculatorModel.workFormat).map(([value, item]) => ({ value, label: item.label })),
  visitType: Object.entries(budgetCalculatorModel.visitType).map(([value, item]) => ({ value, label: item.label })),
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (!hash) {
      return undefined;
    }

    function scrollToHash() {
      const target = document.getElementById(decodeURIComponent(hash));

      if (target) {
        target.scrollIntoView();
      }
    }

    requestAnimationFrame(scrollToHash);
    const timeoutId = window.setTimeout(scrollToHash, 250);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const navItems = [
    ["Для кого", "#audience"],
    ["Задачи", "#tasks"],
    ["Услуги", "#services"],
    ["Процесс", "#workflow"],
    ["FAQ", "#faq"],
    ["Контакты", "#contact"],
    ["Калькулятор", "#budget-calculator"],
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
          <BudgetCalculator onOpenPrivacy={() => setIsPrivacyOpen(true)} />
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

function BudgetCalculator({ onOpenPrivacy }) {
  const [settings, setSettings] = useState(initialBudgetCalculator);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const totals = useMemo(() => calculateBudgetScenario(settings), [settings]);
  const factors = useMemo(() => getBudgetFactors(settings), [settings]);
  const sliderFill = ((settings.tanks - 1) / 29) * 100;

  function updateSetting(name, value) {
    setSettings((current) => ({ ...current, [name]: value }));
  }

  return (
    <>
      <section className="mdc-calc" id="budget-calculator">
        <div className="mdc-wrap">
          <header className="mdc-header">
            <div className="mdc-badge">Интерактивный расчет</div>
            <h2 className="mdc-title">Проверьте, где проект теряет деньги</h2>
            <p className="mdc-subtitle">
              Исходные данные, готовность объекта, срочность и повторные выезды меняют бюджет инженерных
              работ еще до старта.
            </p>
            <p className="mdc-hint">Расчет ориентировочный и не является коммерческим предложением.</p>
          </header>

          <div className="mdc-body">
            <div className="mdc-controls" aria-label="Параметры расчета">
              <div className="mdc-group">
                <div className="mdc-group-top">
                  <span className="mdc-label">Количество танков / отсеков</span>
                  <span className="mdc-value-badge">{settings.tanks}</span>
                </div>
                <div className="mdc-slider-wrap">
                  <input
                    className="mdc-slider"
                    type="range"
                    min="1"
                    max="30"
                    value={settings.tanks}
                    style={{ "--fill": `${sliderFill}%` }}
                    aria-label="Количество танков"
                    onChange={(event) => updateSetting("tanks", Number(event.target.value))}
                  />
                  <div className="mdc-slider-ticks" aria-hidden="true">
                    <span>1</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                  </div>
                </div>
              </div>

              <CalculatorOptionGroup
                label="Качество исходных данных"
                options={calculatorOptionGroups.dataQuality}
                value={settings.dataQuality}
                onChange={(value) => updateSetting("dataQuality", value)}
              />
              <CalculatorOptionGroup
                label="Готовность объекта"
                options={calculatorOptionGroups.objectReadiness}
                value={settings.objectReadiness}
                onChange={(value) => updateSetting("objectReadiness", value)}
              />
              <CalculatorOptionGroup
                label="Срочность"
                options={calculatorOptionGroups.urgency}
                value={settings.urgency}
                onChange={(value) => updateSetting("urgency", value)}
              />
              <CalculatorOptionGroup
                label="Формат работ"
                options={calculatorOptionGroups.workFormat}
                value={settings.workFormat}
                onChange={(value) => updateSetting("workFormat", value)}
                grid
              />
              <CalculatorOptionGroup
                label="Выезд"
                options={calculatorOptionGroups.visitType}
                value={settings.visitType}
                onChange={(value) => updateSetting("visitType", value)}
              />
            </div>

            <div className="mdc-results" aria-live="polite">
              <div className="mdc-loss">
                <span className="mdc-loss-label">Без подготовки вы можете переплатить до</span>
                <span className="mdc-loss-amount">{formatRubles(totals.savings)}</span>
              </div>

              <CalculatorResultCard
                variant="exp"
                icon={<Calculator size={22} />}
                label="Стоимость без подготовки"
                value={formatRubles(totals.expensive)}
              />
              <CalculatorResultCard
                variant="opt"
                icon={<CheckCircle2 size={22} />}
                label="Стоимость при нормальной подготовке"
                value={formatRubles(totals.optimized)}
              />
              <CalculatorResultCard
                variant="save"
                icon={<ClipboardCheck size={22} />}
                label="Потенциальная экономия"
                value={formatRubles(totals.savings)}
              />

              <div className="mdc-factors">
                <div className="mdc-factors-title">Что увеличивает бюджет</div>
                <ul className="mdc-factors-list">
                  {factors.map((factor) => (
                    <li className={factor.risk ? "" : "is-ok"} key={`${factor.text}-${factor.cost || "ok"}`}>
                      <span>{factor.text}</span>
                      {factor.cost ? (
                        <span className={`mdc-factor-cost ${factor.risk ? "" : "is-neutral"}`}>{factor.cost}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mdc-recs">
                <div className="mdc-recs-title">Как снизить стоимость</div>
                <p className="mdc-recs-intro">Подготовьте заранее:</p>
                <ul className="mdc-recs-list">
                  <li>Чертежи судна или объекта</li>
                  <li>Фото танков / отсеков</li>
                  <li>Данные по замерным точкам</li>
                  <li>Доступ к объекту в день работ</li>
                  <li>Список требуемых документов</li>
                </ul>
              </div>

              <button className="mdc-cta" type="button" onClick={() => setIsChecklistOpen(true)}>
                <ClipboardCheck size={18} />
                Получить чек-лист для экономии
              </button>
            </div>
          </div>
        </div>
      </section>

      <ChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        onOpenPrivacy={onOpenPrivacy}
        settings={settings}
        totals={totals}
      />
    </>
  );
}

function CalculatorOptionGroup({ label, options, value, onChange, grid = false }) {
  return (
    <div className="mdc-group">
      <span className="mdc-label">{label}</span>
      <div className={`mdc-toggles ${grid ? "mdc-toggles-grid" : ""}`} role="group" aria-label={label}>
        {options.map((option) => (
          <button
            className={`mdc-toggle ${option.value === value ? "is-active" : ""}`}
            type="button"
            key={option.value}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalculatorResultCard({ variant, icon, label, value }) {
  return (
    <div className={`mdc-card mdc-card-${variant}`}>
      <div className="mdc-card-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="mdc-card-info">
        <div className="mdc-card-label">{label}</div>
        <div className="mdc-card-value">{value}</div>
      </div>
    </div>
  );
}

function ChecklistModal({ isOpen, onClose, onOpenPrivacy, settings, totals }) {
  const [form, setForm] = useState(initialChecklistForm);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [fallbackHref, setFallbackHref] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        closeAndReset();
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: false }));
  }

  function closeAndReset() {
    onClose();
    setForm(initialChecklistForm);
    setStatus(null);
    setErrors({});
    setFallbackHref("");
    setIsSubmitting(false);
  }

  async function submitChecklist(event) {
    event.preventDefault();
    setFallbackHref("");

    const nextErrors = {
      name: !form.name.trim(),
      phone: !form.phone.trim(),
      email: !isEmailValid(form.email),
      consent: !form.consent,
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setStatus({
        type: "error",
        message: "Заполните имя, телефон, корректный email и согласие на обработку данных.",
      });
      return;
    }

    const lead = {
      name: form.name,
      company: "",
      phone: form.phone,
      messenger: "",
      email: form.email,
      vesselType: form.vesselType,
      taskType: "Получить чек-лист для экономии бюджета",
      comment: createChecklistComment(form, settings, totals),
      consent: form.consent,
      website: form.website,
    };

    setIsSubmitting(true);
    setStatus({ type: "pending", message: "Отправляем заявку." });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Не удалось отправить заявку автоматически.");
      }

      setStatus({
        type: "success",
        message: result.message || "Заявка принята. Чек-лист будет отправлен на ваш email.",
      });
      setForm(initialChecklistForm);
    } catch (error) {
      setFallbackHref(createLeadMailto(lead));
      setStatus({
        type: "error",
        message: `${error.message} Можно открыть письмо с уже заполненной заявкой.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="mdc-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeAndReset();
        }
      }}
    >
      <div className="mdc-modal" role="document">
        <button className="mdc-modal-close" type="button" onClick={closeAndReset} aria-label="Закрыть">
          <X size={20} />
        </button>

        {status?.type === "success" ? (
          <div className="mdc-success-view">
            <div className="mdc-success-icon" aria-hidden="true">
              <CheckCircle2 size={44} />
            </div>
            <h3 className="mdc-success-title">Заявка принята</h3>
            <p className="mdc-success-text">{status.message}</p>
            <button className="mdc-success-btn" type="button" onClick={closeAndReset}>
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="mdc-modal-badge">MarineDocs Engineering</div>
            <h3 className="mdc-modal-title" id="checklist-modal-title">
              Получить чек-лист для экономии
            </h3>
            <p className="mdc-modal-desc">
              Пришлем список документов и действий, которые помогают снизить стоимость инженерных работ.
            </p>
            <form className="mdc-form" onSubmit={submitChecklist} noValidate>
              <div className="mdc-form-row">
                <div className="mdc-form-group">
                  <label className="mdc-form-label" htmlFor="checklist-name">
                    Имя
                  </label>
                  <input
                    className={`mdc-form-input ${errors.name ? "is-error" : ""}`}
                    id="checklist-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={updateField}
                    autoComplete="name"
                    maxLength="80"
                    aria-invalid={errors.name || undefined}
                  />
                </div>
                <div className="mdc-form-group">
                  <label className="mdc-form-label" htmlFor="checklist-phone">
                    Телефон
                  </label>
                  <input
                    className={`mdc-form-input ${errors.phone ? "is-error" : ""}`}
                    id="checklist-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateField}
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength="60"
                    aria-invalid={errors.phone || undefined}
                  />
                </div>
              </div>

              <div className="mdc-form-group">
                <label className="mdc-form-label" htmlFor="checklist-email">
                  Email
                </label>
                <input
                  className={`mdc-form-input ${errors.email ? "is-error" : ""}`}
                  id="checklist-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="email"
                  maxLength="120"
                  aria-invalid={errors.email || undefined}
                />
              </div>

              <div className="mdc-form-group">
                <label className="mdc-form-label" htmlFor="checklist-vessel">
                  Тип судна / объекта
                </label>
                <input
                  className="mdc-form-input"
                  id="checklist-vessel"
                  name="vesselType"
                  type="text"
                  value={form.vesselType}
                  onChange={updateField}
                  placeholder="Танкер, сухогруз, платформа..."
                  maxLength="120"
                />
              </div>

              <div className="mdc-form-group">
                <label className="mdc-form-label" htmlFor="checklist-comment">
                  Комментарий
                </label>
                <textarea
                  className="mdc-form-textarea"
                  id="checklist-comment"
                  name="comment"
                  value={form.comment}
                  onChange={updateField}
                  placeholder="Кратко опишите проект..."
                  rows="3"
                  maxLength="900"
                />
              </div>

              <label className="hidden-field" aria-hidden="true">
                <span>Сайт</span>
                <input name="website" value={form.website} onChange={updateField} tabIndex={-1} autoComplete="off" />
              </label>

              <label className={`mdc-consent ${errors.consent ? "is-error" : ""}`}>
                <input name="consent" type="checkbox" checked={form.consent} onChange={updateField} />
                <span>
                  Согласен на обработку персональных данных и принимаю{" "}
                  <button type="button" onClick={onOpenPrivacy}>
                    политику конфиденциальности
                  </button>
                </span>
              </label>

              <button className="mdc-form-submit" type="submit" disabled={isSubmitting}>
                <Send size={18} />
                {isSubmitting ? "Отправляем" : "Получить чек-лист"}
              </button>

              {status ? (
                <div className={`form-status form-status-${status.type}`} role={status.type === "error" ? "alert" : "status"}>
                  <p>{status.message}</p>
                  {fallbackHref ? <a href={fallbackHref}>Открыть письмо</a> : null}
                </div>
              ) : null}
            </form>
          </>
        )}
      </div>
    </div>
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

function calculateBudgetScenario(settings) {
  const optimized =
    budgetCalculatorModel.base +
    settings.tanks * budgetCalculatorModel.perTank +
    budgetCalculatorModel.workFormat[settings.workFormat].cost +
    budgetCalculatorModel.visitType[settings.visitType].cost;
  const riskCosts =
    budgetCalculatorModel.dataQuality[settings.dataQuality].cost +
    budgetCalculatorModel.objectReadiness[settings.objectReadiness].cost;
  const expensive = Math.round((optimized + riskCosts) * budgetCalculatorModel.urgency[settings.urgency].multiplier);
  const savings = Math.max(expensive - optimized, 0);

  return { optimized, expensive, savings };
}

function getBudgetFactors(settings) {
  const factors = [];
  const dataQuality = budgetCalculatorModel.dataQuality[settings.dataQuality];
  const objectReadiness = budgetCalculatorModel.objectReadiness[settings.objectReadiness];
  const urgency = budgetCalculatorModel.urgency[settings.urgency];

  if (dataQuality.cost > 0) {
    factors.push({ text: dataQuality.factor, cost: `+${formatRubles(dataQuality.cost)}`, risk: true });
  }

  if (objectReadiness.cost > 0) {
    factors.push({ text: objectReadiness.factor, cost: `+${formatRubles(objectReadiness.cost)}`, risk: true });
  }

  if (urgency.multiplier > 1) {
    const percent = Math.round((urgency.multiplier - 1) * 100);
    factors.push({ text: urgency.factor, cost: `x${urgency.multiplier.toFixed(1)} (+${percent}%)`, risk: true });
  }

  if (!factors.length) {
    factors.push({ text: "Параметры выглядят оптимально - явной переплаты нет", cost: "", risk: false });
  }

  return factors;
}

function formatRubles(value) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function createChecklistComment(form, settings, totals) {
  const lines = [
    "Запрос чек-листа для экономии бюджета.",
    "",
    "Параметры калькулятора:",
    `Количество танков / отсеков: ${settings.tanks}`,
    `Исходные данные: ${budgetCalculatorModel.dataQuality[settings.dataQuality].label}`,
    `Готовность объекта: ${budgetCalculatorModel.objectReadiness[settings.objectReadiness].label}`,
    `Срочность: ${budgetCalculatorModel.urgency[settings.urgency].label}`,
    `Формат работ: ${budgetCalculatorModel.workFormat[settings.workFormat].label}`,
    `Выезд: ${budgetCalculatorModel.visitType[settings.visitType].label}`,
    "",
    "Ориентировочный расчет:",
    `Стоимость без подготовки: ${formatRubles(totals.expensive)}`,
    `Стоимость при нормальной подготовке: ${formatRubles(totals.optimized)}`,
    `Потенциальная экономия: ${formatRubles(totals.savings)}`,
    "",
    "Комментарий:",
    form.comment || "не указан",
  ];

  return lines.join("\n");
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
