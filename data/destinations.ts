import type { Destination } from "./types";

// Placeholder photography via picsum (deterministic seeds). Swap for real licensed
// Ethiopian photography before launch — keep descriptive alt text in components.
const img = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const destinations: Destination[] = [
  {
    slug: "lalibela",
    name: "Lalibela",
    region: "Amhara",
    keyFact: "11th-century rock-hewn churches carved from solid stone",
    overview:
      "Lalibela is home to eleven medieval monolithic churches hewn directly out of rock in the 12th and 13th centuries, conceived as a 'New Jerusalem'. Still an active place of worship and pilgrimage, it is one of Ethiopia's holiest cities and a UNESCO World Heritage Site.",
    attractions: [
      "Church of St. George (Bete Giyorgis)",
      "Bete Medhane Alem — largest monolithic church in the world",
      "Northern & Eastern church clusters",
      "Asheton Maryam Monastery hike",
    ],
    bestTime:
      "October–March (dry). Visit during Genna (Ethiopian Christmas, Jan 7) or Timkat for unforgettable ceremonies.",
    gettingThere:
      "45-minute domestic flight from Addis Ababa to Lalibela Airport, then a 30-minute drive to town.",
    image: img("lalibela"),
    lat: 12.0317,
    lng: 39.0473,
    distanceFromAddisKm: 645,
  },
  {
    slug: "gondar",
    name: "Gondar",
    region: "Amhara",
    keyFact: "The 'Camelot of Africa' — 17th-century royal castles",
    overview:
      "Once the imperial capital of Ethiopia, Gondar is famed for the Fasil Ghebbi royal enclosure, a fortress-city of castles and palaces, and the breathtaking Debre Birhan Selassie church with its ceiling of winged angels.",
    attractions: [
      "Fasil Ghebbi (Royal Enclosure)",
      "Debre Birhan Selassie Church",
      "Fasilides' Bath (Timkat celebrations)",
      "Empress Mentewab's Palace at Qusquam",
    ],
    bestTime:
      "October–March. Timkat (Jan 19–20) at Fasilides' Bath is among the greatest spectacles in Ethiopia.",
    gettingThere:
      "1-hour flight from Addis Ababa, or overland combined with the Simien Mountains.",
    image: img("gondar"),
    lat: 12.609,
    lng: 37.4671,
    distanceFromAddisKm: 727,
  },
  {
    slug: "axum",
    name: "Axum",
    region: "Tigray",
    keyFact: "Ancient capital with towering granite stelae",
    overview:
      "Axum was the heart of a powerful ancient kingdom that traded with Rome and India. Its giant carved stelae, royal tombs, and the church said to house the Ark of the Covenant make it the cradle of Ethiopian civilisation.",
    attractions: [
      "Northern Stelae Field & the Great Stele",
      "Church of St. Mary of Zion",
      "Queen of Sheba's Palace & Bath",
      "Ezana Stone inscriptions",
    ],
    bestTime: "October–March for clear, dry conditions.",
    gettingThere: "1.5-hour flight from Addis Ababa to Axum Airport.",
    image: img("axum"),
    lat: 14.131,
    lng: 38.7186,
    distanceFromAddisKm: 1024,
  },
  {
    slug: "simien-mountains",
    name: "Simien Mountains",
    region: "Amhara",
    keyFact: "Dramatic escarpments and rare endemic wildlife",
    overview:
      "A UNESCO World Heritage Site, the Simien Mountains National Park offers some of Africa's most spectacular trekking — jagged peaks, 1,000-metre cliffs, and endemic wildlife including the gelada baboon, Walia ibex, and Ethiopian wolf.",
    attractions: [
      "Gelada baboon troops",
      "Sankaber to Geech trekking route",
      "Imet Gogo viewpoint",
      "Ras Dashen — Ethiopia's highest peak (4,550 m)",
    ],
    bestTime:
      "October–March (dry, clear). Trails can be difficult in the June–September rains.",
    gettingThere:
      "Fly to Gondar, then a 3-hour drive to Debark, the park's gateway town.",
    image: img("simien"),
    lat: 13.1833,
    lng: 38.0667,
    distanceFromAddisKm: 800,
  },
  {
    slug: "omo-valley",
    name: "Omo Valley",
    region: "SNNPR",
    keyFact: "Living cultures of more than a dozen indigenous peoples",
    overview:
      "The Lower Omo Valley is one of the most culturally diverse regions on earth, home to the Hamer, Mursi, Karo, Dassanech and other peoples whose traditions endure. A photography and cultural-immersion destination like no other.",
    attractions: [
      "Hamer bull-jumping ceremony",
      "Mursi lip-plate traditions",
      "Karo body-painting on the Omo River",
      "Weekly tribal markets (Key Afer, Dimeka)",
    ],
    bestTime:
      "September–March. Travel respectfully with local guides and fair photography etiquette.",
    gettingThere:
      "Fly to Arba Minch or Jinka, then 4x4 overland to the villages.",
    image: img("omovalley"),
    lat: 5.0,
    lng: 36.0,
    distanceFromAddisKm: 770,
  },
  {
    slug: "danakil-depression",
    name: "Danakil Depression",
    region: "Afar",
    keyFact: "One of the hottest, lowest, most alien landscapes on Earth",
    overview:
      "The Danakil is a surreal expanse of neon sulphur springs, salt flats, lava lakes and below-sea-level desert. Visiting the Dallol hydrothermal field and the active Erta Ale volcano is a true expedition.",
    attractions: [
      "Dallol sulphur springs",
      "Erta Ale lava lake",
      "Lake Asale salt flats & camel caravans",
      "Afar salt-mining culture",
    ],
    bestTime:
      "November–February (still extremely hot). Only travel with organised, guided expeditions.",
    gettingThere:
      "Fly to Mekele, then guided 4x4 convoy into the depression.",
    image: img("danakil"),
    lat: 14.2417,
    lng: 40.3,
    distanceFromAddisKm: 783,
  },
  {
    slug: "harar",
    name: "Harar",
    region: "Harari",
    keyFact: "Walled Islamic holy city with 82 mosques",
    overview:
      "Harar Jugol, a UNESCO World Heritage Site, is considered the fourth-holiest city of Islam. Its labyrinth of colourful alleys, ancient mosques, and the nightly hyena-feeding ritual make it utterly unique.",
    attractions: [
      "The walled old town (Jugol)",
      "Hyena feeding at dusk",
      "Rimbaud House",
      "Colourful Harari markets",
    ],
    bestTime: "October–March for pleasant, dry weather.",
    gettingThere:
      "Fly to Dire Dawa, then a 1-hour scenic drive up to Harar.",
    image: img("harar"),
    lat: 9.3133,
    lng: 42.1281,
    distanceFromAddisKm: 526,
  },
  {
    slug: "bale-mountains",
    name: "Bale Mountains",
    region: "Oromia",
    keyFact: "Afro-alpine plateau and the best place to see the Ethiopian wolf",
    overview:
      "Bale Mountains National Park spans high Afro-alpine moorland, the Sanetti Plateau, and the lush Harenna Forest. It offers the world's best chance to spot the rare Ethiopian wolf, plus mountain nyala and dazzling birdlife.",
    attractions: [
      "Sanetti Plateau & Ethiopian wolves",
      "Mountain nyala in Dinsho",
      "Harenna Forest",
      "Birdwatching (endemics galore)",
    ],
    bestTime: "October–March for wildlife and clear plateau views.",
    gettingThere:
      "Roughly a 6–7 hour scenic drive south from Addis Ababa to Dinsho.",
    image: img("bale"),
    lat: 6.8333,
    lng: 39.7167,
    distanceFromAddisKm: 400,
  },
  {
    slug: "addis-ababa",
    name: "Addis Ababa",
    region: "Addis Ababa",
    keyFact: "Africa's diplomatic capital and a vibrant cultural gateway",
    overview:
      "Ethiopia's bustling capital is the natural starting point for most journeys — home to the National Museum (and 'Lucy'), lively markets, world-class Ethiopian cuisine, and the headquarters of the African Union.",
    attractions: [
      "National Museum (Lucy / Dinkinesh)",
      "Holy Trinity Cathedral",
      "Merkato — one of Africa's largest markets",
      "Entoto Mountain views",
    ],
    bestTime: "Year-round; mild highland climate at 2,355 m elevation.",
    gettingThere:
      "Bole International Airport is the main hub for international arrivals.",
    image: img("addis"),
    lat: 9.0108,
    lng: 38.7613,
    distanceFromAddisKm: 0,
  },
  {
    slug: "gambella",
    name: "Gambella",
    region: "Gambela",
    keyFact: "Lowland wilderness and one of Africa's great mammal migrations",
    overview:
      "Remote Gambella National Park, on the Baro River lowlands, hosts the spectacular white-eared kob migration — a vast movement of antelope rivalling the Serengeti — along with elephants, buffalo and rich birdlife.",
    attractions: [
      "White-eared kob migration",
      "Baro River boat trips",
      "Anuak and Nuer cultures",
      "Untamed lowland birding",
    ],
    bestTime: "November–March (dry season access).",
    gettingThere: "Domestic flight from Addis Ababa to Gambella, then 4x4.",
    image: img("gambella"),
    lat: 8.25,
    lng: 34.5833,
    distanceFromAddisKm: 766,
  },
  {
    slug: "tigray",
    name: "Tigray",
    region: "Tigray",
    keyFact: "Cliff-top rock churches in a dramatic sandstone landscape",
    overview:
      "Tigray's Gheralta region hides dozens of ancient rock-hewn churches perched on sheer cliffs, reached by exhilarating hikes. The scenery — golden sandstone towers and wide valleys — is some of Ethiopia's finest.",
    attractions: [
      "Abuna Yemata Guh cliff church",
      "Maryam Korkor & Daniel Korkor",
      "Gheralta escarpment hikes",
      "Yeha — Ethiopia's oldest standing structure",
    ],
    bestTime: "October–March for safe, dry climbing conditions.",
    gettingThere:
      "Fly to Mekele, then drive into the Gheralta cluster (~2 hours).",
    image: img("tigray"),
    lat: 13.5,
    lng: 39.4833,
    distanceFromAddisKm: 783,
  },
  {
    slug: "dire-dawa",
    name: "Dire Dawa",
    region: "Dire Dawa",
    keyFact: "Historic railway city blending Ethiopian and French heritage",
    overview:
      "Built around the Addis Ababa–Djibouti railway, Dire Dawa has a relaxed, multicultural character with French-colonial architecture, the lively Kefira market, and easy access to Harar and the Awash region.",
    attractions: [
      "Kefira Market",
      "Historic railway station",
      "Greek Orthodox & Catholic churches",
      "Gateway to Harar & cave art at Laga Oda",
    ],
    bestTime: "October–March (it is warm year-round in the lowlands).",
    gettingThere:
      "Frequent flights from Addis Ababa, or the new electric railway.",
    image: img("diredawa"),
    lat: 9.5931,
    lng: 41.8661,
    distanceFromAddisKm: 445,
  },
];

export const getDestination = (slug: string) =>
  destinations.find((d) => d.slug === slug);

export const destinationName = (slug: string) =>
  getDestination(slug)?.name ?? slug;
