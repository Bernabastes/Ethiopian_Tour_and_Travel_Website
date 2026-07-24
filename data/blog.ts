import type { BlogPostItem } from "./types";

export const BLOG_CATEGORIES = [
  "Travel Tips",
  "Destination Guides",
  "Ethiopian Culture",
  "Food & Cuisine",
  "Photography",
  "Wildlife",
  "Practical Info",
  "Client Stories",
] as const;

const cover = (seed: string) => `https://picsum.photos/seed/blog-${seed}/1200/630`;

// Two fully-written starter posts + the remaining planned titles as drafts.
// Preserved and seeded so the blog has real content the owner can edit/expand.
export const blogPosts: BlogPostItem[] = [
  {
    slug: "best-time-to-visit-ethiopia",
    title: "Best Time to Visit Ethiopia: A Month-by-Month Guide",
    excerpt:
      "Ethiopia is a year-round destination, but the experience changes dramatically with the seasons. Here's how to pick the perfect time for your trip.",
    content:
      "Ethiopia's highland climate means it rarely gets unbearably hot, but rainfall is the real factor that shapes your trip.\n\n## The dry season (October–May)\n\nThis is the classic time to visit. Skies are clear, roads are reliable, and trekking in the Simien and Bale mountains is at its best. October and November are especially beautiful, with green landscapes lingering after the rains and wildflowers across the highlands.\n\n## Festival season\n\nTwo of Ethiopia's greatest festivals fall in the dry season: Genna (Ethiopian Christmas) on January 7th and Timkat (Epiphany) on January 19th–20th. Timkat in Gondar is one of the most colourful spectacles in Africa.\n\n## The green season (June–September)\n\nThe rains bring lush, photogenic landscapes and far fewer tourists, with lower prices. Some unpaved roads (notably in the Omo Valley and Danakil) become difficult, so itineraries focus on the accessible historic north.\n\n## Our recommendation\n\nFor a first trip combining the historic route and some trekking, aim for October to early December or January to March. Ready to plan? Browse our [Ethiopia tours](/tours).",
    coverImage: cover("best-time"),
    category: "Travel Tips",
    author: "Habesha Heritage Tours",
    readMinutes: 6,
    metaTitle: "Best Time to Visit Ethiopia — Month-by-Month Guide",
    metaDescription:
      "When is the best time to visit Ethiopia? A month-by-month guide to weather, festivals and the green season to help you plan the perfect trip.",
    published: true,
    publishedAt: "2026-05-02",
  },
  {
    slug: "complete-guide-to-lalibela",
    title: "The Complete Guide to Lalibela's Rock-Hewn Churches",
    excerpt:
      "Carved from solid rock 800 years ago and still alive with pilgrims today — everything you need to know before visiting Lalibela.",
    content:
      "Lalibela is, for many travellers, the single most extraordinary place in Ethiopia: eleven medieval churches hewn downward out of the living rock, conceived as a 'New Jerusalem'.\n\n## A brief history\n\nThe churches are attributed to King Lalibela of the Zagwe dynasty in the 12th–13th centuries. They remain active places of worship, and visiting during a major festival is unforgettable.\n\n## The church clusters\n\nThe churches divide into a north-western group, a south-eastern group, and the iconic, free-standing Bete Giyorgis (Church of St. George), carved in the shape of a cross.\n\n## Practical tips\n\n- Wear socks you don't mind removing repeatedly — shoes come off at every church.\n- Mornings offer the best light and the most active services.\n- Hire a licensed guide; the history and symbolism are easy to miss on your own.\n\nSee our [Lalibela tours](/tours/lalibela-rock-churches-tour) to visit with an expert local guide.",
    coverImage: cover("lalibela"),
    category: "Destination Guides",
    author: "Habesha Heritage Tours",
    readMinutes: 7,
    metaTitle: "Complete Guide to Lalibela's Rock-Hewn Churches",
    metaDescription:
      "Everything you need to know before visiting Lalibela: history, the church clusters, festivals and practical tips for the rock-hewn churches.",
    published: true,
    publishedAt: "2026-04-18",
  },
  // Remaining planned titles, seeded as drafts to expand later (§7.1).
  ...[
    ["ethiopia-visa-guide", "Ethiopia Visa Guide: e-Visa Step by Step", "Practical Info"],
    ["what-to-pack-for-ethiopia", "What to Pack for Ethiopia", "Travel Tips"],
    ["ethiopian-food-guide", "An Introduction to Ethiopian Food", "Food & Cuisine"],
    ["simien-mountains-trekking-guide", "Simien Mountains Trekking Guide", "Destination Guides"],
    ["is-ethiopia-safe-to-travel", "Is Ethiopia Safe to Travel?", "Practical Info"],
    ["ethiopia-vs-kenya-safari", "Ethiopia vs Kenya: Which Safari Is Right for You?", "Wildlife"],
    ["timkat-festival-guide", "Timkat Festival: A Complete Guide", "Ethiopian Culture"],
    ["danakil-depression-what-to-expect", "Danakil Depression Tour — What to Expect", "Destination Guides"],
  ].map(([slug, title, category], i) => ({
    slug,
    title,
    excerpt: `${title} — our in-depth guide is coming soon. Contact us in the meantime for tailored advice.`,
    content: `This guide is being written. In the meantime, our team is happy to answer any questions — just [get in touch](/contact).`,
    coverImage: cover(slug),
    category,
    author: "Habesha Heritage Tours",
    readMinutes: 5,
    published: false,
    publishedAt: undefined,
  })),
];
