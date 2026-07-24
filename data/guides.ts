import type { Guide } from "./types";

const p = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

export const guides: Guide[] = [
  {
    slug: "abebe-tadesse",
    name: "Abebe Tadesse",
    title: "Senior Cultural Guide",
    yearsExperience: 16,
    licenseNumber: "ETO-G-0142",
    specialties: ["Northern Historical Circuit", "Lalibela", "Orthodox heritage"],
    languages: ["Amharic", "English", "French"],
    bio: "Born in Lalibela, Abebe has spent his life sharing the stories of Ethiopia's rock-hewn churches. His deep knowledge of Orthodox tradition turns every visit into a moving experience.",
    rating: 4.9,
    image: p("guide-abebe"),
  },
  {
    slug: "mekdes-girma",
    name: "Mekdes Girma",
    title: "Trekking & Wildlife Guide",
    yearsExperience: 11,
    licenseNumber: "ETO-G-0317",
    specialties: ["Simien Mountains", "Bale Mountains", "Birdwatching"],
    languages: ["Amharic", "English", "German"],
    bio: "A certified mountain guide, Mekdes knows the Simien and Bale highlands intimately. She is a passionate naturalist with a gift for spotting endemic wildlife before anyone else.",
    rating: 4.8,
    image: p("guide-mekdes"),
  },
  {
    slug: "tariku-bekele",
    name: "Tariku Bekele",
    title: "Omo Valley Specialist",
    yearsExperience: 13,
    licenseNumber: "ETO-G-0205",
    specialties: ["Omo Valley", "Cultural photography", "Overland expeditions"],
    languages: ["Amharic", "English", "Spanish"],
    bio: "Tariku has built genuine, long-term relationships with communities across the Lower Omo. He ensures every cultural encounter is respectful, fair and authentic.",
    rating: 4.7,
    image: p("guide-tariku"),
  },
  {
    slug: "selamawit-hailu",
    name: "Selamawit Hailu",
    title: "Historic Route & Festivals Guide",
    yearsExperience: 9,
    licenseNumber: "ETO-G-0388",
    specialties: ["Gondar & Axum", "Timkat & Genna festivals", "Family tours"],
    languages: ["Amharic", "English", "Italian"],
    bio: "Selamawit's warmth and storytelling make her a favourite with families. She is an expert on Ethiopia's great religious festivals and the imperial history of the north.",
    rating: 4.9,
    image: p("guide-selam"),
  },
];

export const getGuide = (slug: string) => guides.find((gd) => gd.slug === slug);
