const BUSINESS_WHATSAPP = "918585004555";
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("is-open", !isExpanded);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("is-open");
  });
});

const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");

function setTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  themeLabel.textContent = theme === "dark" ? "Daytime mode" : "Evening mode";
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light color theme" : "Switch to dark color theme");
}

setTheme(localStorage.getItem("sds-theme") || "light");
themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
  localStorage.setItem("sds-theme", nextTheme);
  setTheme(nextTheme);
});

const cookieBanner = document.querySelector("#cookie-banner");
const cookieKey = "sds-cookie-notice";
if (!localStorage.getItem(cookieKey)) cookieBanner.hidden = false;
cookieBanner.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.setItem(cookieKey, "seen");
    cookieBanner.hidden = true;
  });
});

function trackEvent(eventName, parameters = {}) {
  const detail = { event: eventName, ...parameters };
  window.dispatchEvent(new CustomEvent("digitalgrow:conversion", { detail }));
  if (typeof window.gtag === "function") window.gtag("event", eventName, parameters);
}

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => trackEvent(element.dataset.track));
});

const assessmentDialog = document.querySelector("#assessment");
const questionPanel = document.querySelector("#assessment-questions");
const resultPanel = document.querySelector("#assessment-result");
const questionTitle = document.querySelector("#assessment-question");
const questionHint = document.querySelector("#assessment-hint");
const optionsPanel = document.querySelector("#assessment-options");
const progressLabel = document.querySelector("#assessment-step-label");
const progressValue = document.querySelector("#assessment-progress-value");
const progressBar = document.querySelector("#assessment-progress-bar");
const backButton = document.querySelector("#assessment-back");
const nextButton = document.querySelector("#assessment-next");
const answers = [];
let currentQuestion = 0;
let assessmentComplete = false;
let recommendation;

const questions = [
  {
    title: "What kind of business do you run?",
    hint: "This helps us show examples and features that make sense for you.",
    options: [
      ["local-shop", "A local shop or service"],
      ["restaurant-hotel", "A restaurant, hotel or homestay"],
      ["coaching-centre", "A school, tutor or coaching centre"],
      ["consultant", "A consultant or professional service"],
      ["online-shop", "An online shop or D2C brand"],
      ["startup-other", "A startup or something else"]
    ]
  },
  {
    title: "What would you like your website to do?",
    hint: "Choose the outcome that matters most right now.",
    options: [
      ["simple-presence", "Show my business online"],
      ["get-enquiries", "Bring in calls and WhatsApp enquiries"],
      ["get-bookings", "Help people book or enquire about admission"],
      ["sell-online", "Show products and sell online"],
      ["improve-site", "Refresh or improve an existing website"]
    ]
  },
  {
    title: "Where are you starting from?",
    hint: "There’s no wrong answer—we’ll shape the next steps around it.",
    options: [
      ["no-site", "I don’t have a website yet"],
      ["old-site", "I have an old site that needs an update"],
      ["working-site", "My site works, but I want to improve it"]
    ]
  },
  {
    title: "What would be most useful on the site?",
    hint: "Pick the closest fit. We can work out the details together.",
    options: [
      ["contact-map", "Services, contact details and a map"],
      ["menu-courses", "A menu, courses or batch information"],
      ["bookings", "Bookings or admission enquiries"],
      ["products-payments", "Product listings and online payments"],
      ["not-sure", "I’m not sure yet"]
    ]
  },
  {
    title: "How ready is your content?",
    hint: "Content can include your logo, photos, service details or product information.",
    options: [
      ["ready", "I have most of it ready"],
      ["some-ready", "I have some things, not everything"],
      ["need-help", "I’ll need help getting started"]
    ]
  },
  {
    title: "When would you like to go live?",
    hint: "A typical small-business website takes about 7–14 days once the scope and content are ready.",
    options: [
      ["soon", "As soon as we can"],
      ["few-weeks", "In a few weeks"],
      ["exploring", "I’m exploring my options"]
    ]
  }
];

function renderQuestion() {
  const question = questions[currentQuestion];
  const selected = answers[currentQuestion];
  questionTitle.textContent = question.title;
  questionHint.textContent = question.hint;
  progressLabel.textContent = `QUESTION ${currentQuestion + 1} OF ${questions.length}`;
  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);
  progressValue.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  backButton.disabled = currentQuestion === 0;
  nextButton.innerHTML = currentQuestion === questions.length - 1
    ? 'See my recommendation <span aria-hidden="true">→</span>'
    : 'Next question <span aria-hidden="true">→</span>';
  optionsPanel.innerHTML = question.options.map(([value, label], index) => {
    const id = `assessment-option-${currentQuestion}-${index}`;
    return `<label class="assessment-option${selected === value ? " is-selected" : ""}" for="${id}"><input id="${id}" type="radio" name="assessment-answer" value="${value}"${selected === value ? " checked" : ""}><span class="option-radio" aria-hidden="true"></span><span>${label}</span><span class="option-arrow" aria-hidden="true">↗</span></label>`;
  }).join("");
  nextButton.disabled = !selected;
  optionsPanel.querySelectorAll('input[name="assessment-answer"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      answers[currentQuestion] = radio.value;
      optionsPanel.querySelectorAll(".assessment-option").forEach((option) => option.classList.remove("is-selected"));
      radio.closest(".assessment-option").classList.add("is-selected");
      nextButton.disabled = false;
    });
  });
}

function getRecommendation() {
  const [business, goal, siteStatus, feature] = answers;
  if (business === "online-shop" || goal === "sell-online" || feature === "products-payments") {
    return {
      website: "An online store",
      package: "E-commerce",
      price: "₹19,999",
      reason: "Your answers point to a product catalogue and online sales. The E-commerce package is the best place to scope that together."
    };
  }
  if (goal === "improve-site" || siteStatus !== "no-site") {
    return {
      website: "A business website refresh",
      package: "Premium Business",
      price: "₹14,999",
      reason: "You already have a site or need a broader refresh. Premium Business is a useful starting point for agreeing the pages and improvements."
    };
  }
  if (goal === "simple-presence" && feature === "contact-map") {
    return {
      website: "A simple business website",
      package: "Basic Starter",
      price: "₹4,999",
      reason: "A clear introduction, essential business details and an easy way to get in touch are a practical first step."
    };
  }
  if (business === "restaurant-hotel" || business === "coaching-centre" || business === "consultant" || business === "local-shop") {
    return {
      website: "A professional business website",
      package: "Professional Business",
      price: "₹8,999",
      reason: "A professional site can make your services easier to understand and give customers a clear path to contact you."
    };
  }
  return {
    website: "A professional business website",
    package: "Professional Business",
    price: "₹8,999",
    reason: "This is a flexible starting point for your goals. We can confirm the right scope together before you commit."
  };
}

function makeReference() {
  const stamp = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DG-${stamp}-${suffix}`;
}

function completeAssessment() {
  recommendation = getRecommendation();
  recommendation.reference = makeReference();
  recommendation.business = questions[0].options.find(([value]) => value === answers[0])?.[1] || "Business";
  recommendation.goal = questions[1].options.find(([value]) => value === answers[1])?.[1] || "";
  recommendation.summary = answers.map((answer, index) => {
    const label = questions[index].options.find(([value]) => value === answer)?.[1];
    return `${questions[index].title} ${label}`;
  }).join("\n");
  document.querySelector("#recommendation-type").textContent = recommendation.website;
  document.querySelector("#recommendation-reason").textContent = recommendation.reason;
  document.querySelector("#recommendation-package").textContent = recommendation.package;
  document.querySelector("#recommendation-price").textContent = `${recommendation.price}*`;
  document.querySelector("#assessment-reference").textContent = recommendation.reference;
  const whatsappMessage = [
    "Hi Subhadip, I completed the DigitalGrow website assessment.",
    `Reference: ${recommendation.reference}`,
    `Business: ${recommendation.business}`,
    `Recommended: ${recommendation.package} from ${recommendation.price}`,
    `Goal: ${recommendation.goal}`
  ].join("\n");
  const whatsappLink = document.querySelector("#assessment-whatsapp");
  whatsappLink.href = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
  questionPanel.hidden = true;
  resultPanel.hidden = false;
  document.querySelector("#recommendation-type").focus();
  assessmentComplete = true;
  trackEvent("assessment_complete", { recommendation: recommendation.package });
}

function openAssessment(event) {
  event.preventDefault();
  answers.length = 0;
  currentQuestion = 0;
  assessmentComplete = false;
  recommendation = null;
  resultPanel.hidden = true;
  questionPanel.hidden = false;
  renderQuestion();
  assessmentDialog.showModal();
  questionTitle.focus();
  trackEvent("assessment_start");
}

document.querySelectorAll("[data-open-assessment]").forEach((link) => {
  link.addEventListener("click", openAssessment);
});

document.querySelector(".assessment-close").addEventListener("click", () => assessmentDialog.close());
assessmentDialog.addEventListener("close", () => {
  if (!assessmentComplete && currentQuestion > 0) {
    trackEvent("assessment_abandon", { question_number: currentQuestion + 1 });
  }
});

backButton.addEventListener("click", () => {
  if (currentQuestion === 0) return;
  currentQuestion -= 1;
  renderQuestion();
  questionTitle.focus();
});

nextButton.addEventListener("click", () => {
  const selected = optionsPanel.querySelector('input[name="assessment-answer"]:checked');
  if (!selected) return;
  answers[currentQuestion] = selected.value;
  trackEvent("assessment_question_complete", { question_number: currentQuestion + 1 });
  if (currentQuestion === questions.length - 1) {
    completeAssessment();
    return;
  }
  currentQuestion += 1;
  renderQuestion();
  questionTitle.focus();
});

document.querySelector("#assessment-restart").addEventListener("click", () => {
  answers.length = 0;
  currentQuestion = 0;
  assessmentComplete = false;
  questionPanel.hidden = false;
  resultPanel.hidden = true;
  renderQuestion();
  questionTitle.focus();
  trackEvent("assessment_start", { restarted: true });
});

const form = document.querySelector("#lead-form");
const formStatus = document.querySelector("#form-status");
const contactProject = form.querySelector('[name="project"]');

function prefillEnquiry(data) {
  if (!data) return;
  const projectMap = {
    "online-shop": "E-commerce store",
    "restaurant-hotel": "Restaurant or hotel website",
    "coaching-centre": "School or coaching website",
    consultant: "Business website",
    "local-shop": "Business website",
    "startup-other": "Something else"
  };
  contactProject.value = projectMap[data.businessValue] || "Business website";
  form.querySelector('[name="package"]').value = data.package || "";
  form.querySelector('[name="reference"]').value = data.reference || "";
  form.querySelector('[name="assessmentSummary"]').value = data.summary || "";
  const textarea = form.querySelector('[name="message"]');
  textarea.value = [
    data.summary ? `Assessment reference: ${data.reference}\nRecommendation: ${data.package} from ${data.price}\n\n${data.summary}` : "",
    textarea.value
  ].filter(Boolean).join("\n\n");
  document.querySelector("#assessment").close();
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form.querySelector('[name="name"]').focus(), 450);
}

document.querySelector("#assessment-enquiry").addEventListener("click", () => {
  if (!recommendation) return;
  prefillEnquiry({
    businessValue: answers[0],
    package: recommendation.package,
    price: recommendation.price,
    reference: recommendation.reference,
    summary: recommendation.summary
  });
});

const urlParams = new URLSearchParams(window.location.search);
const serviceParam = urlParams.get("service");
const packageParam = urlParams.get("package");
if (serviceParam) {
  const serviceOption = [...contactProject.options].find((option) =>
    option.value.toLowerCase() === serviceParam.toLowerCase() ||
    option.text.toLowerCase() === serviceParam.toLowerCase()
  );
  if (serviceOption) contactProject.value = serviceOption.value;
}
if (packageParam) form.querySelector('[name="package"]').value = packageParam;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  if (data.get("website")) return;

  const lead = {
    name: data.get("name"),
    email: data.get("email"),
    project: data.get("project"),
    package: data.get("package"),
    reference: data.get("reference"),
    assessment: data.get("assessmentSummary"),
    message: data.get("message"),
    submittedAt: new Date().toISOString()
  };
  const storedLeads = JSON.parse(localStorage.getItem("sds-enquiries") || "[]");
  storedLeads.push(lead);
  localStorage.setItem("sds-enquiries", JSON.stringify(storedLeads));
  trackEvent("form_submit", { project_type: lead.project, reference: lead.reference || undefined });
  form.reset();
  formStatus.textContent = `Thanks—your enquiry${lead.reference ? ` (${lead.reference})` : ""} is saved in this browser preview. Connect a form service before launch to receive it.`;
});

document.querySelector("#year").textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
