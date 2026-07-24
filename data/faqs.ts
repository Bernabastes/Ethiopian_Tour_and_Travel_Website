import type { Faq } from "./types";

// Grouped FAQ content (§6.4). Categories preserved from the spec.
export const faqs: Faq[] = [
  {
    category: "Visa & Entry",
    question: "Do I need a visa to visit Ethiopia?",
    answer:
      "Most nationalities require a visa. The easiest option is the Ethiopian e-Visa, applied for online before travel at evisa.gov.et. A single-entry tourist e-Visa typically costs around USD 82 for 30 days and is usually approved within 1–3 business days. Always carry a printed copy on arrival.",
  },
  {
    category: "Visa & Entry",
    question: "How long does the e-Visa take to process?",
    answer:
      "Processing is normally 1–3 business days, but we recommend applying at least two weeks before departure to allow a buffer. We send every booked traveller a step-by-step e-Visa guide.",
  },
  {
    category: "Best Time to Visit",
    question: "When is the best time to travel to Ethiopia?",
    answer:
      "October to May is the dry season and the best time for most tours, especially trekking and the historic north. June to September is the green/rainy season — landscapes are lush and prices lower, but some roads become difficult. Major festivals like Timkat (January) and Meskel (September) are spectacular times to visit.",
  },
  {
    category: "Best Time to Visit",
    question: "What is the weather like in the highlands?",
    answer:
      "Ethiopia's highlands sit at 2,000–3,000+ m, so days are mild (18–25°C) and nights can be cold, especially in the Simien and Bale mountains where temperatures drop below freezing. Pack warm layers even when visiting in the dry season.",
  },
  {
    category: "Health & Safety",
    question: "What vaccinations do I need?",
    answer:
      "A Yellow Fever certificate is required if arriving from a country with risk of transmission, and recommended generally. Hepatitis A & B, typhoid and routine vaccinations are advised. Consult a travel clinic 6–8 weeks before departure for personalised advice.",
  },
  {
    category: "Health & Safety",
    question: "Is there a malaria risk?",
    answer:
      "Malaria risk exists in lowland areas below ~2,000 m (such as the Omo Valley, Danakil and Gambella) but not in the high-altitude highlands or Addis Ababa. Anti-malarial prophylaxis is recommended for lowland itineraries — please consult your doctor.",
  },
  {
    category: "Health & Safety",
    question: "Is Ethiopia safe for tourists?",
    answer:
      "The classic tourist destinations we operate are generally safe and welcoming. We continuously monitor conditions, plan routes accordingly, and provide a 24/7 emergency contact for travellers on tour. We will always advise honestly if any area should be avoided.",
  },
  {
    category: "Payments & Pricing",
    question: "What currency should I bring?",
    answer:
      "Ethiopia's currency is the Birr (ETB). Bring some US dollars (clean, post-2013 notes) to exchange on arrival; ATMs are available in cities but can be unreliable. Tour balances can be paid by bank transfer, and we are adding card and mobile-money options.",
  },
  {
    category: "Payments & Pricing",
    question: "How do deposits and payments work?",
    answer:
      "We confirm your booking with a 30% deposit, with the balance due before the tour starts. You can pay by international bank transfer today; Stripe, PayPal, Telebirr and CBE Birr options are being added. You'll receive a clear invoice for every payment.",
  },
  {
    category: "During the Tour",
    question: "What is included in the tour price?",
    answer:
      "Inclusions vary by tour but typically cover accommodation, listed meals, a licensed guide, private transport, domestic flights where stated, park and entrance fees, and bottled water. Each tour page lists exactly what is and isn't included.",
  },
  {
    category: "During the Tour",
    question: "What fitness level do I need?",
    answer:
      "Cultural and historic tours are easy and suit most ages. Treks in the Simien and Bale mountains and the Danakil expedition are more demanding and require good fitness. Every tour page shows a difficulty badge — contact us if you're unsure.",
  },
  {
    category: "After the Tour",
    question: "Can you help with airport transfers and extensions?",
    answer:
      "Yes. We arrange airport pickups and drop-offs for all guests and are happy to add extra nights, city tours or combine destinations into a custom itinerary. Just ask your booking coordinator.",
  },
];

export const faqCategories = () => Array.from(new Set(faqs.map((f) => f.category)));
