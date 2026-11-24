export interface AttractionImage {
  url: string;
  caption: string;
  alt: string;
}

export interface Attraction {
  slug: string;
  name: string;
  sinhalaName: string;
  category: "railway" | "attractions";
  categoryLabel: string;
  distance: string;
  travelTime: string;
  elevation: string;
  badge: string;
  featured: boolean;
  heroImage: string;
  images: AttractionImage[];
  shortDescription: string;
  overview: string[];
  highlights: string[];
  activities: string[];
  bestTimeToVisit: string;
  suggestedDuration: string;
  temperature: string;
  ticketInfo: string;
  howToReachFromVilla: string;
  transportOptions: string;
  googleMapsUrl: string;
}

export const ATTRACTIONS: Attraction[] = [
  {
    slug: "ohiya-railway-station",
    name: "Ohiya Railway Station",
    sinhalaName: "ඔහිය දුම්රිය ස්ථානය",
    category: "railway",
    categoryLabel: "Railway & Heritage",
    distance: "200 m (950 ft)",
    travelTime: "3-minute gentle walk",
    elevation: "1,775 m (5,820 ft)",
    badge: "3-Min Walk from Villa",
    featured: true,
    heroImage: "/images/attractions/ohiya-railway-station/ohiya-railway-station-1.jpg",
    images: [
      {
        url: "/images/attractions/ohiya-railway-station/ohiya-railway-station-1.jpg",
        caption: "Iconic colonial-era Ohiya Railway Station platform surrounded by mist",
        alt: "Ohiya Railway Station platform with classic British colonial name board"
      },
      {
        url: "/images/attractions/ohiya-railway-station/ohiya-railway-station-2.jpg",
        caption: "Scenic Main Line tracks curving into the mountain pine forest",
        alt: "Train arriving at Ohiya station on the scenic hill country railway"
      },
      {
        url: "/images/attractions/ohiya-railway-station/ohiya-railway-station-3.jpg",
        caption: "Early morning mountain clouds hovering over the station roof",
        alt: "Misty mountain surroundings of Ohiya station"
      },
      {
        url: "/images/attractions/ohiya-railway-station/ohiya-railway-station-4.jpg",
        caption: "Historic signal lamps and track switchers preserved from the 1890s",
        alt: "Colonial British railway engineering at Ohiya station"
      }
    ],
    shortDescription: "3rd highest railway station in Sri Lanka, nestled among pine hills just 200m from our bungalow door.",
    overview: [
      "Ohiya Railway Station is the third highest railway station in Sri Lanka, situated at an altitude of 1,775 meters (5,820 ft) on the world-renowned Colombo to Badulla Main Line. Built by British colonial railway engineers in 1893, this quaint stone-and-timber station is famed for its atmospheric mist that rolls across the platforms like clockwork every afternoon.",
      "The station serves as the ultimate launching pad for travelers visiting Horton Plains National Park and adventurers embarking on the rugged Devil's Staircase trek down to Kalupahana. Arriving here by the morning scenic express train, with cool pine-scented breezes greeting you as you step onto the platform, is an unforgettable Sri Lankan highland experience.",
      "Because Dawn Breezy Bungalow is located merely 200 meters from the station exit on Welimada Road, our guests enjoy effortless transfers without needing taxi arrangements. You can step off the train, stroll 3 minutes up the gentle incline, and immediately relax with hot Ceylon tea on our veranda."
    ],
    highlights: [
      "Third highest railway station in Sri Lanka (1,775 m above sea level)",
      "Historic British colonial architectural details dating back to 1893",
      "Prime gateway station for Horton Plains National Park & Devil's Staircase",
      "Spectacular views of incoming blue passenger trains emerging through thick fog",
      "Safe baggage drop and ticket booking counter for scenic train journeys to Ella or Kandy"
    ],
    activities: [
      "Platform photography & train spotting (watch the legendary Podi Menike & Udarata Menike trains)",
      "Gentle stroll along misty pine-fringed railway verges",
      "Boarding the scenic morning train to Pattipola, Idalgashinna, or Ella",
      "Enjoying fresh hot tea and local rotti from station tea kiosks"
    ],
    bestTimeToVisit: "Early morning (6:30 AM - 9:00 AM) or late afternoon (3:30 PM - 5:30 PM) when trains arrive amidst enchanting fog banks.",
    suggestedDuration: "30 minutes to 1 hour (or transit point)",
    temperature: "12°C - 20°C (cool & breezy, drops to 10°C at night)",
    ticketInfo: "Station platform ticket is approx. Rs. 20 - 50. Train tickets to Ella, Pattipola, or Nanu Oya can be purchased directly at the station counter.",
    howToReachFromVilla: "Turn left outside Dawn Breezy Bungalow gate on Welimada Road and walk 200 meters. The station building is directly ahead. Susantha will gladly assist with rolling luggage.",
    transportOptions: "Walking (3 minutes). Susantha provides luggage escort upon arrival if notified in advance.",
    googleMapsUrl: "https://maps.google.com/?q=Ohiya+Railway+Station+Sri+Lanka"
  },
  {
    slug: "horton-plains",
    name: "Horton Plains National Park & World's End",
    sinhalaName: "හෝටන් තැන්න ජාතික වනෝද්‍යානය සහ ලෝකාන්තය",
    category: "attractions",
    categoryLabel: "Nature & Viewpoints",
    distance: "11 km (~4 miles)",
    travelTime: "25-30 minutes drive",
    elevation: "2,100 m - 2,300 m (7,500 ft)",
    badge: "Must-Visit World Heritage Site",
    featured: true,
    heroImage: "/images/attractions/horton-plains/horton-plains-1.jpg",
    images: [
      {
        url: "/images/attractions/horton-plains/horton-plains-1.jpg",
        caption: "Breathtaking sheer drop from World's End cliff overlooking southern tea valleys",
        alt: "World's End cliff drop at Horton Plains National Park"
      },
      {
        url: "/images/attractions/horton-plains/horton-plains-2.jpg",
        caption: "Baker's Falls cascading gracefully through pristine highland cloud forests",
        alt: "Baker's Falls waterfall in Horton Plains"
      },
      {
        url: "/images/attractions/horton-plains/horton-plains-3.jpg",
        caption: "Montane grassland plateau teeming with native Sambar deer",
        alt: "Sambar deer grazing on the misty grasslands of Horton Plains"
      },
      {
        url: "/images/attractions/horton-plains/horton-plains-4.jpg",
        caption: "Mini World's End viewpoint offering vast panoramic vistas of Balangoda",
        alt: "Mini World's End panoramic mountain vista"
      }
    ],
    shortDescription: "UNESCO World Heritage highland plateau featuring the 870m World's End cliff, Baker's Falls, and wild Sambar deer.",
    overview: [
      "Horton Plains National Park is Sri Lanka's most celebrated montane wilderness and a designated UNESCO World Heritage Site. Perched on a windswept plateau exceeding 2,100 meters above sea level, it encompasses dwarf cloud forests, rolling tussock grasslands, sparkling crystal streams, and sheer escarpments that plunge dramatically into the southern plains.",
      "The undisputed star of the park is 'World's End', a sheer vertical drop of approximately 870 meters (2,854 feet). On clear mornings before the cloud blanket rolls in, the viewpoint commands views stretching all the way to the southern coastline and the Indian Ocean. A second cliff, 'Mini World's End', drops 270 meters and offers equally spectacular panoramas.",
      "The classic 9.5 km circular hiking trail also leads visitors past Baker's Falls, a magnificent 20-meter waterfall formed by the Belihul Oya river cascading over wide metamorphic rock ledges. Along the route, hikers frequently encounter herds of majestic Sambar deer, endemic purple-faced langurs, and rare alpine bird species found nowhere else on earth.",
      "Dawn Breezy Bungalow in Ohiya is one of the closest comfortable accommodations to the park's official entrance gate. Staying with us allows you to depart at 5:30 AM, enter the park right as gates open at 6:00 AM, and witness World's End in its crystal-clear early morning splendour before clouds obscure the precipice."
    ],
    highlights: [
      "Greater World's End cliff with an 870-meter (2,854 ft) sheer vertical drop",
      "Mini World's End cliff overlooking the verdant tea estates of Balangoda",
      "Baker's Falls surrounded by rhododendron trees and wild ferns",
      "Scenic 9.5 km circular walking loop through cloud forest and savannah grassland",
      "Encounters with wild Sambar deer, crested serpent eagles, and yellow-eared bulbuls",
      "Chimney Pool & the headwaters of three of Sri Lanka's major rivers (Mahaweli, Kelani, Walawe)"
    ],
    activities: [
      "9.5 km morning nature hike (approx. 3 - 4 hours at a leisure pace)",
      "Landscape & bird photography in the morning golden hour",
      "Waterfall viewing & relaxing by Baker's Falls viewing deck",
      "Wildlife observation across wet patana grasslands"
    ],
    bestTimeToVisit: "Between 6:00 AM and 9:30 AM. After 10:00 AM, thick white mist often rises from the southern plains, turning World's End into a wall of white fog.",
    suggestedDuration: "3.5 to 5 hours for the full circular trail and visitor center",
    temperature: "8°C - 16°C. Can dip to near-freezing (2°C - 5°C) in early mornings during December - February.",
    ticketInfo: "Entry permits are issued at the DWC Department of Wildlife ticket counter. Foreign adults ~US $35 + taxes; local visitors Rs. 150 - 300 + vehicle service charges. Plastic polythene wrapping is strictly prohibited and removed at the gate.",
    howToReachFromVilla: "A picturesque 25-minute drive (11 km) via Ohiya-Horton Plains Road through winding pine forests. Susantha arranges 4WD safari jeeps and trusted vans directly from our driveway at 5:30 AM with hot packed breakfast.",
    transportOptions: "4WD Safari Jeep / Dedicated Van / Tuk-Tuk arranged directly by Susantha at Dawn Breezy Bungalow.",
    googleMapsUrl: "https://maps.google.com/?q=Horton+Plains+National+Park+Entrance"
  },
  {
    slug: "pattipola-railway-station",
    name: "Pattipola Railway Station & Summit Level",
    sinhalaName: "පත්තිපොල දුම්රිය ස්ථානය සහ සමිට් ලෙවල්",
    category: "railway",
    categoryLabel: "Railway & Heritage",
    distance: "4.3 km (2.7 miles)",
    travelTime: "10-minute scenic train or drive",
    elevation: "1,897.5 m (6,225 ft)",
    badge: "Highest Railway Station in Sri Lanka",
    featured: true,
    heroImage: "/images/attractions/pattipola-railway-station/pattipola-railway-station-1.jpg",
    images: [
      {
        url: "/images/attractions/pattipola-railway-station/pattipola-railway-station-1.jpg",
        caption: "Pattipola Station: the absolute highest railway station in Sri Lanka at 6,225 ft",
        alt: "Pattipola Railway station sign board showing elevation 1897.5m"
      },
      {
        url: "/images/attractions/pattipola-railway-station/pattipola-railway-station-2.jpg",
        caption: "Historic Summit Level Tunnel (Tunnel No. 18) piercing the mountain divide",
        alt: "Summit level railway tunnel near Pattipola"
      },
      {
        url: "/images/attractions/pattipola-railway-station/pattipola-railway-station-3.jpg",
        caption: "Chilly pine forests and misty eucalyptus groves surrounding the station",
        alt: "Scenic forest surrounding Pattipola railway station"
      },
      {
        url: "/images/attractions/pattipola-railway-station/pattipola-railway-station-4.jpg",
        caption: "Passenger train navigating the highest elevation curves on the Main Line",
        alt: "Sri Lanka railway train at Pattipola"
      }
    ],
    shortDescription: "The highest railway station in Sri Lanka at 1,897.5m above sea level, home to Summit Level Tunnel No. 18.",
    overview: [
      "Pattipola Railway Station holds the prestigious title of being the highest railway station in Sri Lanka, standing at 1,897.5 meters (6,225 feet) above sea level. Located just one train station north of Ohiya, it is a quintessential highland outpost known for crisp alpine air, dense cypress plantations, and dramatic weather shifts.",
      "Just north of the station lies the famous 'Summit Level', the highest geographical point along Sri Lanka's entire 1,500 km railway network. Here, trains pass through Tunnel No. 18 (Pattipola Tunnel), which cuts through the central mountain spine. This tunnel marks an incredible meteorological boundary: entering from the cloudy, wet eastern slope often brings you out into bright sunshine on the western side, or vice versa!",
      "Visiting Pattipola from Dawn Breezy Bungalow is remarkably easy: hop on the morning train at Ohiya Station for a 10-minute joyride, or take a quick scenic drive through the hill forests. It's a favorite stop for railway photographers, train enthusiasts, and hikers."
    ],
    highlights: [
      "Officially the highest railway station on the island (1,897.5 meters)",
      "Summit Level Tunnel No. 18: highest point on Sri Lanka Railways",
      "Unique climate divide where two distinct weather zones meet",
      "Serene highland village ambiance with towering eucalyptus and pine trees",
      "Perfect quick train hop from Ohiya Railway Station"
    ],
    activities: [
      "Photographing the iconic Pattipola elevation signpost",
      "Experiencing the scenic 10-minute train journey through mountain passes from Ohiya",
      "Walking to the Summit Level Tunnel vantage point",
      "Tasting fresh mountain vegetable dishes and tea at local village stalls"
    ],
    bestTimeToVisit: "Morning hours (8:00 AM - 11:30 AM) when mountain views are clearest and trains pass frequently.",
    suggestedDuration: "45 minutes to 1.5 hours",
    temperature: "10°C - 18°C (one of the coldest populated points in Sri Lanka)",
    ticketInfo: "Free to visit the station and town. Train tickets from Ohiya to Pattipola cost under Rs. 50.",
    howToReachFromVilla: "Take the train from Ohiya Station (10 minutes, one stop) or drive 4.3 km via Ohiya-Pattipola Road (approx. 10 minutes).",
    transportOptions: "Train from Ohiya Station / Tuk-tuk / Private vehicle.",
    googleMapsUrl: "https://maps.google.com/?q=Pattipola+Railway+Station+Sri+Lanka"
  },
  {
    slug: "ambewela-farms",
    name: "Ambewela Farm (Little New Zealand)",
    sinhalaName: "අඹේවෙල ගොවිපළ (පුංචි නවසීලන්තය)",
    category: "attractions",
    categoryLabel: "Nature & Viewpoints",
    distance: "7.7 km (4.8 miles)",
    travelTime: "15-20 minutes drive",
    elevation: "1,830 m (6,000 ft)",
    badge: "Little New Zealand of Sri Lanka",
    featured: true,
    heroImage: "/images/attractions/ambewela-farms/ambewela-farms-1.jpg",
    images: [
      {
        url: "/images/attractions/ambewela-farms/ambewela-farms-1.jpg",
        caption: "Verdant green pastures and black-and-white Friesian dairy cows",
        alt: "Cows grazing on lush green hills of Ambewela Farm"
      },
      {
        url: "/images/attractions/ambewela-farms/ambewela-farms-2.jpg",
        caption: "Iconic wind turbines turning slowly above the misty Ambewela hills",
        alt: "Wind turbines over rolling pastures at Ambewela"
      },
      {
        url: "/images/attractions/ambewela-farms/ambewela-farms-3.jpg",
        caption: "Calf nursery and modern dairy processing barns open to visitors",
        alt: "Dairy farming facility and calves at Ambewela Farm"
      },
      {
        url: "/images/attractions/ambewela-farms/ambewela-farms-4.jpg",
        caption: "Panoramic vistas across the rolling highland farm reminiscent of New Zealand",
        alt: "Landscape view of Ambewela dairy farm"
      }
    ],
    shortDescription: "Rolling green hills, pedigree dairy cattle, wind turbines, and fresh warm milk & dairy cafe in 'Little New Zealand'.",
    overview: [
      "Often hailed as 'Little New Zealand', Ambewela Farm spans hundreds of acres of verdant rolling pastures dotted with white-and-black Friesian cows, modern dairy barns, and giant electricity-generating wind turbines. The misty mountain backdrop and pastoral landscapes create a European alpine charm rarely seen in tropical South Asia.",
      "The farm is split into Ambewela Farm and New Zealand Farm. Visitors can tour the nursery sheds to bottle-feed adorable calves, observe automated computerized milking carousels, learn about cheese and butter production, and walk along manicured farm paths surrounded by cool mountain breezes.",
      "A visit is incomplete without stopping by the farm cafe to savor warm fresh full-cream milk, artisanal Gouda cheese, strawberry yoghurt, and freshly whipped cream treats. It's a delightful, family-friendly outing located just 15-20 minutes from Dawn Breezy Bungalow."
    ],
    highlights: [
      "Vast rolling pastures with pedigree Holstein Friesian and Ayrshire cows",
      "Interactive calf feeding stations and modern dairy milking demonstrations",
      "Scenic wind turbines towering over the misty green hills",
      "On-site dairy parlor serving fresh warm milk, ice cream, cheese, and yoghurt",
      "Superb landscape photography resembling the European countryside"
    ],
    activities: [
      "Farm walking tour along designated scenic trails",
      "Watching the automated milking process and visiting the rabbit & goat enclosures",
      "Tasting fresh artisanal dairy products at the farm cafe",
      "Family and children's recreational activities"
    ],
    bestTimeToVisit: "9:00 AM to 1:00 PM when milking demonstrations occur and weather is sunny.",
    suggestedDuration: "2 to 3 hours",
    temperature: "14°C - 21°C",
    ticketInfo: "Entry ticket is approx. Rs. 200 - 500 per person (parking charges may apply).",
    howToReachFromVilla: "Drive 7.7 km north via Pattipola Road and Ambewela Road (approx. 18 minutes). Susantha can arrange a round-trip tuk-tuk or car for you.",
    transportOptions: "Tuk-tuk or taxi / Scenic train to Ambewela Station + 5 min tuk-tuk.",
    googleMapsUrl: "https://maps.google.com/?q=Ambewela+Farm+Sri+Lanka"
  },
  {
    slug: "bambarakanda-falls",
    name: "Bambarakanda Falls",
    sinhalaName: "බඹරකන්ද ඇල්ල",
    category: "attractions",
    categoryLabel: "Nature & Viewpoints",
    distance: "12 km (scenic off-road trail)",
    travelTime: "30-40 minutes drive or hike",
    elevation: "1,100 m - 1,500 m",
    badge: "Sri Lanka's Tallest Waterfall (263m)",
    featured: true,
    heroImage: "/images/attractions/bambarakanda-falls/bambarakanda-falls-1.jpg",
    images: [
      {
        url: "/images/attractions/bambarakanda-falls/bambarakanda-falls-1.jpg",
        caption: "Sri Lanka's tallest waterfall plummeting 263 meters through pine-covered cliffs",
        alt: "Bambarakanda Falls plunging down mountain cliff"
      },
      {
        url: "/images/attractions/bambarakanda-falls/bambarakanda-falls-2.jpg",
        caption: "Deep rock plunge pool and spray at the base of the waterfall",
        alt: "Base of Bambarakanda waterfall"
      },
      {
        url: "/images/attractions/bambarakanda-falls/bambarakanda-falls-3.jpg",
        caption: "Lush pine tree trails leading along the Kuda Oya canyon",
        alt: "Pine forest trail leading to Bambarakanda Falls"
      },
      {
        url: "/images/attractions/bambarakanda-falls/bambarakanda-falls-4.jpg",
        caption: "View of Bambarakanda from the scenic Devil's Staircase trail",
        alt: "Panoramic view of Bambarakanda Falls"
      }
    ],
    shortDescription: "Sri Lanka's highest waterfall, dropping an astonishing 263 meters (863 ft) through towering pine-covered rock bluffs.",
    overview: [
      "Plummeting an incredible 263 meters (863 feet) down a sheer granite cliff in the Kalupahana valley, Bambarakanda Falls (also known as Bambarakele Falls) is officially the tallest waterfall in Sri Lanka and ranks among the most spectacular natural wonders in the Indian Ocean region.",
      "Fed by the Kuda Oya, a tributary of the Walawe River, the falls resemble a white silk ribbon suspended against dark basalt cliffs and dense evergreen pine forests. During the monsoon and rainy months, the waterfall thunders with intense volume, creating swirling clouds of mist and rainbows across the gorge.",
      "The trail from Ohiya down towards Bambarakanda passes through the legendary 'Devil's Staircase', a thrilling mountain trail through remote tea estates and cliff-edge bends. For hikers and adventure lovers staying at Dawn Breezy Bungalow, trekking or taking a 4WD excursion down this route is one of Sri Lanka's greatest wilderness adventures."
    ],
    highlights: [
      "Highest waterfall in Sri Lanka (263 meters / 863 feet tall)",
      "Ranked among the top 300 tallest waterfalls on earth",
      "Natural plunge pool and secluded smaller upper pools (Lanka Ella nearby)",
      "Direct connection to the famed Devil's Staircase trekking route from Ohiya",
      "Fragrant pine forest walking trails and wooden suspension viewing bridges"
    ],
    activities: [
      "Hiking down the pine trail to the base viewing platform",
      "Off-road 4WD / mountain biking along the Devil's Staircase route",
      "Swimming in safe shallow pools downstream (exercise caution at the main fall)",
      "Nature photography of the full waterfall drop"
    ],
    bestTimeToVisit: "Morning to early afternoon (8:00 AM - 2:00 PM). Especially impressive during or after rainfall when water levels surge.",
    suggestedDuration: "2 to 4 hours (or full-day hike if walking from Ohiya)",
    temperature: "18°C - 24°C (warmer than Ohiya summit as it descends towards Kalupahana)",
    ticketInfo: "Nominal entrance fee of approx. Rs. 50 - 150 maintained by the local Pradeshiya Sabha.",
    howToReachFromVilla: "Located 12 km downhill from Ohiya. Can be accessed by hiring a 4WD jeep through the Devil's Staircase or driving via Haputale-Beragala-Kalupahana.",
    transportOptions: "4WD Safari Jeep or Guided Trek arranged by Susantha / Private vehicle via Kalupahana.",
    googleMapsUrl: "https://maps.google.com/?q=Bambarakanda+Falls+Sri+Lanka"
  },
  {
    slug: "ambewela-railway-station",
    name: "Ambewela Railway Station",
    sinhalaName: "අඹේවෙල දුම්රිය ස්ථානය",
    category: "railway",
    categoryLabel: "Railway & Heritage",
    distance: "7.2 km (4.5 miles)",
    travelTime: "15 minutes train or drive",
    elevation: "1,828 m (5,997 ft)",
    badge: "2nd Highest Station in Sri Lanka",
    featured: false,
    heroImage: "/images/attractions/ambewela-railway-station/ambewela-railway-station-1.jpg",
    images: [
      {
        url: "/images/attractions/ambewela-railway-station/ambewela-railway-station-1.jpg",
        caption: "Ambewela Station nestled among rolling green farm hills and vegetable terraces",
        alt: "Ambewela Railway station building and railway track"
      },
      {
        url: "/images/attractions/ambewela-railway-station/ambewela-railway-station-2.jpg",
        caption: "Blue Sri Lanka Railways train halting at the misty Ambewela platform",
        alt: "Train arriving at Ambewela station"
      },
      {
        url: "/images/attractions/ambewela-railway-station/ambewela-railway-station-3.jpg",
        caption: "Scenic railway bends passing close to dairy cattle pastures",
        alt: "Railway line near Ambewela farm"
      },
      {
        url: "/images/attractions/ambewela-railway-station/ambewela-railway-station-4.jpg",
        caption: "Colonial railway architecture and pristine floral gardens kept by the station master",
        alt: "Ambewela station flower garden and sign"
      }
    ],
    shortDescription: "Second highest railway station in Sri Lanka (1,828m), surrounded by dairy pastures, vegetable farms, and cool mountain air.",
    overview: [
      "Ambewela Railway Station is the second highest railway station in Sri Lanka, standing at an elevation of 1,828 meters (5,997 ft). Situated between Pattipola and Nanu Oya on the Main Line, it is known for having one of the most picturesque station yards in the hill country, adorned with colourful montane flower gardens maintained by station staff.",
      "The station is surrounded by endless green terraces of leeks, carrots, potatoes, and the famous Ambewela dairy farm meadows. Stepping off the train here immediately envelops you in clean alpine breezes and rustic highland charm.",
      "For visitors seeking an authentic railway adventure, taking the short train ride from Ohiya through Pattipola to Ambewela is one of the most delightful 20-minute train hops in Asia, crossing high mountain passes and cloud valleys."
    ],
    highlights: [
      "Second highest railway station in Sri Lanka (1,828m elevation)",
      "Award-winning highland flower garden along the platform",
      "Stunning scenery of dairy meadows and vegetable step-terraces",
      "Immediate proximity to Ambewela Dairy Farm & New Zealand Farm",
      "Convenient intermediate stop on the Colombo to Badulla scenic line"
    ],
    activities: [
      "Taking photos of the mountain train entering through farm hills",
      "Enjoying warm tea and fresh snacks at local station stalls",
      "Easy connection to Ambewela Farm or continuing on to Nanu Oya (Nuwara Eliya)"
    ],
    bestTimeToVisit: "Morning to midday (8:30 AM - 1:30 PM)",
    suggestedDuration: "30 minutes to 1 hour",
    temperature: "12°C - 20°C",
    ticketInfo: "Free to visit station. Train tickets from Ohiya cost approx. Rs. 40 - 60.",
    howToReachFromVilla: "Two train stops north from Ohiya Station (approx. 18 mins), or drive 7.2 km via Pattipola Road.",
    transportOptions: "Train from Ohiya Station / Tuk-tuk / Private vehicle.",
    googleMapsUrl: "https://maps.google.com/?q=Ambewela+Railway+Station+Sri+Lanka"
  },
  {
    slug: "hakgala-botanical-garden",
    name: "Hakgala Botanical Garden",
    sinhalaName: "හක්ගල උද්භිද උද්‍යානය",
    category: "attractions",
    categoryLabel: "Nature & Viewpoints",
    distance: "12 km (7.5 miles)",
    travelTime: "25 minutes drive",
    elevation: "1,745 m (5,725 ft)",
    badge: "Subtropical Montane Botanic Garden",
    featured: false,
    heroImage: "/images/attractions/hakgala-botanical-garden/hakgala-botanical-garden-1.jpg",
    images: [
      {
        url: "/images/attractions/hakgala-botanical-garden/hakgala-botanical-garden-1.jpg",
        caption: "Magnificent towering granite crag of Hakgala Rock rising behind the gardens",
        alt: "Hakgala Rock and botanical garden lawns"
      },
      {
        url: "/images/attractions/hakgala-botanical-garden/hakgala-botanical-garden-2.jpg",
        caption: "Vibrant rose garden boasting hundreds of temperate and English rose varieties",
        alt: "Rose garden at Hakgala Botanical Garden"
      },
      {
        url: "/images/attractions/hakgala-botanical-garden/hakgala-botanical-garden-3.jpg",
        caption: "Shaded fernery with prehistoric tree ferns and rare montane orchids",
        alt: "Fernery and pathways at Hakgala Garden"
      },
      {
        url: "/images/attractions/hakgala-botanical-garden/hakgala-botanical-garden-4.jpg",
        caption: "Japanese garden featuring ornamental water bridges, bamboo, and weeping cypresses",
        alt: "Japanese garden area at Hakgala"
      }
    ],
    shortDescription: "Established in 1861 beneath the massive Hakgala Rock; features famous rose gardens, alpine ferneries, and Ramayana mythology.",
    overview: [
      "Spread across 28 hectares beneath the towering 2,200m monolithic cliff of Hakgala Rock (Elephant Jaw Rock), Hakgala Botanical Garden is the second largest botanical garden in Sri Lanka and one of the highest botanical gardens in the world.",
      "Established in 1861 by English botanist Dr. G.H.K. Thwaites originally for experimental cultivation of Cinchona (quinine) trees, it later evolved into a world-class montane botanical garden. Today, it showcases over 10,000 species of flora, including an illustrious Rose Garden with centuries-old English rose cultivars, an expansive Fernery shaded by towering tree ferns, an Orchid House with rare sub-tropical species, and a tranquil Japanese Garden.",
      "Hakgala also holds profound mythic significance in Hindu and Sri Lankan folklore as the legendary Ashok Vatika from the Ramayana epic, where King Ravana kept Princess Sita captive. The revered Sita Amman Temple stands just 1 km down the road from the garden gate."
    ],
    highlights: [
      "Breathtaking backdrop of the sheer Hakgala Rock rising into the clouds",
      "Celebrated Rose Garden blooming with hybrid teas, floribundas, and heritage roses",
      "Subtropical Fernery with ancient Australian and Sri Lankan tree ferns",
      "Orchid collection and vibrant displays of azaleas, camellias, and hydrangeas",
      "Historic links to the Ramayana epic and Sita Amman Temple"
    ],
    activities: [
      "Leisurely walking along moss-lined botanical trails and wooden bridges",
      "Botanical and nature macro photography",
      "Visiting the nearby historic Sita Amman Temple",
      "Enjoying a relaxed garden picnic amidst cool highland pine air"
    ],
    bestTimeToVisit: "9:00 AM to 3:00 PM. April and May bring peak spring blooms during the Nuwara Eliya season.",
    suggestedDuration: "2 to 3 hours",
    temperature: "14°C - 22°C",
    ticketInfo: "Entry ticket is approx. Rs. 200 for locals, ~US $10 for foreign visitors.",
    howToReachFromVilla: "Drive 12 km north-east via Welimada-Nuwara Eliya Road (approx. 25 minutes). Susantha can arrange seamless vehicle transport.",
    transportOptions: "Private car / Van / Tuk-tuk arranged by Susantha.",
    googleMapsUrl: "https://maps.google.com/?q=Hakgala+Botanical+Garden+Sri+Lanka"
  },
  {
    slug: "gregory-lake",
    name: "Gregory Lake (Nuwara Eliya)",
    sinhalaName: "ග්‍රෙගරි වැව (නුවරඑළිය)",
    category: "attractions",
    categoryLabel: "Nature & Viewpoints",
    distance: "17 km (10.5 miles)",
    travelTime: "35-40 minutes drive",
    elevation: "1,868 m (6,128 ft)",
    badge: "Highland Lakeside Promenade",
    featured: false,
    heroImage: "/images/attractions/gregory-lake/gregory-lake-1.jpg",
    images: [
      {
        url: "/images/attractions/gregory-lake/gregory-lake-1.jpg",
        caption: "Tranquil waters of Gregory Lake reflecting the misty Pidurutalagala mountain range",
        alt: "Gregory Lake waters with mountain reflections in Nuwara Eliya"
      },
      {
        url: "/images/attractions/gregory-lake/gregory-lake-2.jpg",
        caption: "Colorful swan pedal boats and speedboats gliding across the freshwater reservoir",
        alt: "Boating on Gregory Lake Nuwara Eliya"
      },
      {
        url: "/images/attractions/gregory-lake/gregory-lake-3.jpg",
        caption: "Lakeside paved walking and cycling promenade lined with blooming flowerbeds",
        alt: "Walking promenade beside Lake Gregory"
      },
      {
        url: "/images/attractions/gregory-lake/gregory-lake-4.jpg",
        caption: "Pony rides and waterfront dining cafes along the lake esplanade",
        alt: "Recreation and pony rides near Lake Gregory"
      }
    ],
    shortDescription: "Iconic colonial-era highland lake offering swan boat rides, jet skis, lakeside pony rides, and food stalls.",
    overview: [
      "Constructed in 1873 during the British colonial era under Governor Sir William Gregory, Gregory Lake is the vibrant aquatic centerpiece of 'Little England' in Nuwara Eliya. Spanning 91 hectares, the lake was originally created to harvest hydro power and provide a recreational boating basin for highland tea planters.",
      "Today, the lake has been transformed into a premier leisure park featuring a paved 5 km walking and cycling promenade, well-manicured floral gardens, and open-air wooden dining pavilions. Visitors can enjoy swan-shaped pedal boats, high-speed jet skis, scenic boat cruises, pony rides along the bank, and bicycle rentals.",
      "The lake is flanked by Mount Pidurutalagala (Sri Lanka's highest peak) on one side and rolling tea hills on the other. It makes for an ideal afternoon day trip from Dawn Breezy Bungalow, combining colonial architecture with lively lakeside entertainment."
    ],
    highlights: [
      "Scenic 91-hectare highland lake surrounded by pine mountains and tea hills",
      "Swan pedal boats, motorized speedboats, and family boat tours",
      "Paved cycling and walking promenade with bicycle rentals",
      "Pony riding for children and families along the lakeside green",
      "Waterfront food street offering hot street food, local snacks, and Ceylon tea"
    ],
    activities: [
      "Pedal boating and water sports across the cool mountain water",
      "Walking or jogging along the scenic waterfront pathway",
      "Horse and pony riding on the green lakeside turf",
      "Sampling fresh hot strawberry treats, barbecue, and Ceylon spiced tea"
    ],
    bestTimeToVisit: "Late morning to sunset (10:00 AM - 5:30 PM). Sunset over the lake is particularly picturesque.",
    suggestedDuration: "2 to 3 hours",
    temperature: "13°C - 21°C",
    ticketInfo: "Park admission ticket is approx. Rs. 50 - 100 for locals, approx. Rs. 500 for foreign visitors. Boat and pony rides have separate fixed fees.",
    howToReachFromVilla: "Drive 17 km north towards Nuwara Eliya via Ambewela or Hakgala road (approx. 35 minutes). Susantha can organize a full day Nuwara Eliya excursion.",
    transportOptions: "Private car / Van / Tuk-tuk / Scenic train to Nanu Oya + bus/taxi.",
    googleMapsUrl: "https://maps.google.com/?q=Gregory+Lake+Nuwara+Eliya"
  },
  {
    slug: "castlereigh-reservoir",
    name: "Castlereigh Reservoir & Seaplane Base",
    sinhalaName: "කාස්ල්රී ජලාශය සහ සීප්ලේන් තොටුපළ",
    category: "attractions",
    categoryLabel: "Nature & Viewpoints",
    distance: "Scenic Day Trip (~80 km)",
    travelTime: "2 hours scenic highland drive",
    elevation: "1,170 m (3,838 ft)",
    badge: "Emerald Valley Water Aerodrome",
    featured: false,
    heroImage: "/images/attractions/castlereigh-reservoir/castlereigh-reservoir-1.jpg",
    images: [
      {
        url: "/images/attractions/castlereigh-reservoir/castlereigh-reservoir-1.jpg",
        caption: "Emerald green mirror-like waters of Castlereigh Reservoir framed by lush tea estates",
        alt: "Panoramic view of Castlereigh Reservoir"
      },
      {
        url: "/images/attractions/castlereigh-reservoir/castlereigh-reservoir-2.jpg",
        caption: "The majestic Castlereigh Gravity Dam holding the headwaters of the Kehelgamu Oya",
        alt: "Castlereigh dam structure in Sri Lanka"
      },
      {
        url: "/images/attractions/castlereigh-reservoir/castlereigh-reservoir-3.jpg",
        caption: "Cinnamon Air amphibious Cessna seaplane touching down on the calm reservoir surface",
        alt: "Seaplane water aerodrome on Castlereigh Reservoir"
      },
      {
        url: "/images/attractions/castlereigh-reservoir/castlereigh-reservoir-4.jpg",
        caption: "Historic British tea bungalows and pine-shaded shorelines surrounding the lake",
        alt: "Tea estate bungalow overlooking Castlereigh Reservoir"
      }
    ],
    shortDescription: "Pristine emerald reservoir surrounded by manicured tea estates, historic planter bungalows, and Cinnamon Air seaplane aerodrome.",
    overview: [
      "Nestled deeply within the emerald valleys of the Bogawantalawa tea region (the Golden Valley of Ceylon Tea), Castlereigh Reservoir is one of the most mesmerizing bodies of water in Sri Lanka. Formed by an impressive gravity dam constructed across the Kehelgamu Oya in 1958, the reservoir feeds the Wimalasurendra hydroelectric powerhouse.",
      "The reservoir's glassy, jade-colored waters are encircled by rolling hills of immaculately pruned tea bushes, towering bamboo clusters, and century-old colonial planter bungalows. It is also home to Sri Lanka's most scenic water aerodrome, where amphibious Cessna aircraft operated by Cinnamon Air land directly on the lake, connecting Colombo to the tea country.",
      "A day excursion to Castlereigh offers travelers an unforgettable immersion into classic Ceylon tea heritage, boat rides on serene tranquil waters, and stops at colonial churches and tea factory tasting sessions."
    ],
    highlights: [
      "Breathtaking turquoise-green waters reflecting surrounding mountain peaks",
      "Spectacular view of amphibious seaplanes landing and taking off from the water",
      "Surrounded by historic colonial-era Ceylon Tea estates and stone churches",
      "Calm, peaceful kayaking and catamaran boating experiences",
      "Castlereigh Dam engineering viewpoint overlooking the river canyon"
    ],
    activities: [
      "Scenic lakeside driving and photography along winding tea estate roads",
      "Watching seaplane maneuvers on the water surface",
      "Tea factory visits and artisanal tea tastings nearby in Hatton / Dickoya",
      "Peaceful shore walks and bird watching along the water edge"
    ],
    bestTimeToVisit: "Morning to early afternoon (9:00 AM - 2:00 PM)",
    suggestedDuration: "Half-day to full-day excursion",
    temperature: "16°C - 24°C",
    ticketInfo: "Free public viewing points around the reservoir and dam bridge.",
    howToReachFromVilla: "Drive west towards Talawakele and Hatton/Dickoya via scenic mountain passes (approx. 2 hours). Ideal as a guided day tour or en-route transfer.",
    transportOptions: "Chauffeured car or van arranged by Susantha.",
    googleMapsUrl: "https://maps.google.com/?q=Castlereigh+Reservoir+Sri+Lanka"
  },
  {
    slug: "devils-staircase",
    name: "Devil's Staircase & Udaweriya Valley",
    sinhalaName: "ඩෙවිල්ස් ස්ටෙයාර්කේස් සහ උඩවේරිය නිම්නය",
    category: "attractions",
    categoryLabel: "Nature & Viewpoints",
    distance: "Starts directly in Ohiya (14 km trek)",
    travelTime: "Starts from our bungalow door",
    elevation: "1,100 m - 1,890 m",
    badge: "Legendary Trekking Route",
    featured: true,
    heroImage: "/images/attractions/devils-staircase/devils-staircase-1.jpg",
    images: [
      {
        url: "/images/attractions/devils-staircase/devils-staircase-1.jpg",
        caption: "The legendary zigzagging hairpin bends of the Devil's Staircase descending into Kalupahana",
        alt: "Devil's Staircase hairpin bends and mountain trails"
      },
      {
        url: "/images/attractions/devils-staircase/devils-staircase-2.jpg",
        caption: "Pristine tea plantations and misty gorges of the remote Udaweriya Valley",
        alt: "Udaweriya valley tea estate near Ohiya"
      },
      {
        url: "/images/attractions/devils-staircase/devils-staircase-3.jpg",
        caption: "Sweeping views of Bambarakanda and Lanka Ella falls from high mountain ledges",
        alt: "Waterfall viewpoint along the Devil's Staircase hike"
      },
      {
        url: "/images/attractions/devils-staircase/devils-staircase-4.jpg",
        caption: "Thrilling off-road 4WD tracks and hikers navigating the rocky highland path",
        alt: "Hikers on the Devil's Staircase trail"
      }
    ],
    shortDescription: "Sri Lanka's most iconic wilderness hike starting right from Ohiya, descending through hairpin bends, tea estates, and Bambarakanda Falls.",
    overview: [
      "The 'Devil's Staircase' is undisputed as one of the most thrilling and scenic trekking routes in Sri Lanka. Spanning approximately 14 kilometers from the misty heights of Ohiya (approx. 1,800m) down to Kalupahana (approx. 1,100m), the trail earns its dramatic name from its steep gradients, narrow rocky ledges, and razor-sharp zigzagging hairpin turns.",
      "The trail winds through the historic Udaweriya Tea Estate, one of the most remote colonial tea plantations in Sri Lanka. It passes misty mountain gaps, bubbling natural springs, abandoned tea workers' cottages, and towering eucalyptus forests. Halfway down, the path crosses close to the crest and base of Bambarakanda Falls, treating trekkers to roaring water vistas from above.",
      "Because Dawn Breezy Bungalow is situated in Ohiya, our guests are literally at the doorstep of this world-famous trek! You can enjoy a wholesome early morning breakfast, step right out onto the trail with trekking poles, and complete the exhilarating downhill hike to Kalupahana, where Susantha can arrange transport back or onward travel."
    ],
    highlights: [
      "One of the top 5 greatest adventure trekking routes in Sri Lanka",
      "Starts right in Ohiya just minutes from Dawn Breezy Bungalow",
      "Iconic 'V-Cut' cliff pass carved straight through solid mountain rock",
      "Stunning panoramas of the southern plains of Balangoda and Hambantota on clear days",
      "Passes upper cascades of Bambarakanda and Lanka Ella waterfalls",
      "Thrilling terrain for avid hikers, trail runners, and 4WD off-road enthusiasts"
    ],
    activities: [
      "Full-day downhill hiking trek (approx. 4 - 5 hours of moderate-intensity trekking)",
      "4WD off-road safari jeep adventures across rocky ledges",
      "Mountain photography of deep canyon drops, tea pluckers, and mountain vistas",
      "Wild swimming at secluded mountain streams along the route"
    ],
    bestTimeToVisit: "Early morning (6:30 AM - 8:00 AM start time) to enjoy cool mountain temperatures and clear vistas before midday clouds gather.",
    suggestedDuration: "4 to 6 hours for the full trek",
    temperature: "14°C at the start in Ohiya, warming up to 24°C in the Kalupahana valley",
    ticketInfo: "Free public trail. Nominal waterfall fee applies if entering the Bambarakanda lower gate.",
    howToReachFromVilla: "Step right out of Dawn Breezy Bungalow and follow the trail towards Udaweriya Estate. Susantha can provide trail maps, packed lunches, local trekking guides, and arrange pick-up at Kalupahana.",
    transportOptions: "Walking on foot / 4WD Safari Jeep arranged by Susantha.",
    googleMapsUrl: "https://maps.google.com/?q=Devils+Staircase+Ohiya+Sri+Lanka"
  }
];

export function getAttractionBySlug(slug: string): Attraction | undefined {
  return ATTRACTIONS.find((a) => a.slug === slug);
}

export function getAllAttractionSlugs(): string[] {
  return ATTRACTIONS.map((a) => a.slug);
}
