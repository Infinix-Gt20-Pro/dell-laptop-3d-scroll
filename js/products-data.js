/**
 * Classic Computers - Certified Refurbished Hub Data Store
 * Catalog of certified refurbished enterprise laptops, workstations, and desktops
 */

var STORE_CONFIG = (typeof window !== 'undefined' && window.STORE_CONFIG) ? window.STORE_CONFIG : {
  storeName: "Classic Computers",
  tagline: "India's Premier Certified Refurbished Enterprise Laptops & Computers Hub",
  whatsappNumber: "919412182786",
  supportPhone: "+91 94121 82786",
  secondaryPhone: "+91 84758 82785",
  instagramUrl: "https://www.instagram.com/classic.computer.empire/",
  instagramHandle: "@classic.computer.empire",
  reelUrl: "https://www.instagram.com/classic.computer.empire/reel/DcY0IRLh2sZ/",
  supportEmail: "classiccomputers.etah@gmail.com",
  address: "Classic Computers, Near Railway Road / GT Road, Etah, Uttar Pradesh - 207001, India",
  gstNumber: "09AKZPA9666PZZT",
  features: {
    warrantyMonths: 6,
    replacementDays: 7,
    inspectionPoints: 30,
    freeDelivery: true
  },
  buildWhatsAppUrl: function (product, config = {}) {
    if (!product) return `https://wa.me/${this.whatsappNumber}`;
    const ram = config.ram || (product.specs && product.specs.ram) || 'Standard Enterprise RAM';
    const ssd = config.ssd || (product.specs && product.specs.storage) || 'Fast NVMe SSD';
    const price = config.price || product.price || 0;
    const grade = product.grade || 'Grade A+ (Pristine Condition)';
    const processor = (product.specs && product.specs.processor) || 'Enterprise CPU';
    const gpu = (product.specs && product.specs.gpu) || 'Integrated Graphics';
    const display = (product.specs && product.specs.display) || 'Standard Screen';

    const lines = [
      `*ORDER INQUIRY — Classic Computers* 💻`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Device:* ${product.name}`,
      `*Grade:* ${grade}`,
      `*CPU:* ${processor}`,
      `*RAM Selected:* ${ram}`,
      `*Storage Selected:* ${ssd}`,
      `*Graphics:* ${gpu}`,
      `*Display:* ${display}`,
      `*Warranty:* 6 Months Warranty + 7-Day Replacement`,
      `*Shipping:* Free & Insured Pan-India Delivery 🚚`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*Total Price:* ₹${Number(price).toLocaleString('en-IN')} (GST Included)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `*My Delivery Address / City:* `,
      `[Type your address & pincode here]`,
      ``,
      `Please confirm stock availability and send payment / dispatch details!`
    ];

    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  }
};

var PRODUCTS = (typeof window !== 'undefined' && window.PRODUCTS) ? window.PRODUCTS : [
  {
    id: "dell-5530-flagship",
    name: "Dell Precision 5530 4K UHD Mobile Workstation",
    shortName: "Dell 5530 4K Workstation",
    badge: "⭐ BESTSELLER FOR 4K EDITING & CAD",
    category: "workstation",
    deviceType: "laptop",
    brand: "Dell",
    originalPrice: 185000,
    price: 34999,
    discountPercentage: 81,
    grade: "Grade A+ (Pristine Condition)",
    rating: 4.9,
    reviewsCount: 148,
    isFeatured: true,
    thumbnail: "assets/images/dell-5530/dell_5530_cafe.jpg",
    images: [
      "assets/images/dell-5530/dell_5530_cafe.jpg",
      "assets/images/dell-5530/dell_5530_keyboard.jpg",
      "assets/images/dell-5530/dell_5530_ports.jpg",
      "assets/images/dell-5530/dell_5530_dark.jpg",
      "assets/images/dell-5530/dell_5530_white.jpg",
      "assets/images/dell-5530/dell_5530_coffee.jpg"
    ],
    bestFor: "4K Video Editing (Premiere Pro, DaVinci Resolve), Adobe Suite, Architectural AutoCAD, 3D Blender Modeling, and Intensive Multi-tasking",
    suitability: ["editing", "cad", "creative", "laptop"],
    suitabilityBadge: "Best for 4K Video Editing & CAD",
    highlights: [
      "Intel Core i7-8850H 8th Gen H-Series Processor (6 Cores, 12 Threads, 4.30 GHz Turbo)",
      "4GB Dedicated NVIDIA Quadro Graphics + Intel UHD 630 Dual GPU",
      "15.6-inch 4K UHD (3840 x 2160) UltraSharp 100% AdobeRGB Touch Screen",
      "Aircraft-Grade CNC Machined Aluminum Body with Carbon-Fiber Deck",
      "Certified 30-Point Tested with 90%+ Battery Health Guaranteed"
    ],
    specs: {
      processor: "Intel Core i7-8850H (6 Cores, 12 Threads, up to 4.30 GHz Turbo)",
      ram: "8GB DDR4 (Expandable up to 64GB Dual Channel)",
      storage: "256GB NVMe High-Speed SSD (Upgradable to 2TB)",
      gpu: "4GB Dedicated NVIDIA Quadro P1000 ISV-Certified",
      display: "15.6-inch 4K UHD (3840 x 2160) InfinityEdge Touch, 100% AdobeRGB, 400 nits",
      chassis: "Precision CNC Aluminum Lid with Carbon-Fiber Composite Palmrest",
      ports: "2x USB 3.1 with PowerShare, 1x Thunderbolt 3 (USB-C), 1x HDMI 2.0, SD Card Reader",
      battery: "Original OEM 97Wh Battery (Health checked 90%+), 130W Dell Slim Adapter included",
      os: "Windows 11 Pro 64-bit Genuine Licensed",
      weight: "1.78 kg"
    },
    inStock: 5,
    customizable: true
  },
  {
    id: "thinkpad-t480-classic",
    name: "Lenovo ThinkPad T480 Dual-Battery Business Laptop",
    shortName: "Lenovo ThinkPad T480",
    badge: "💻 BEST FOR CODING & STUDENTS",
    category: "business",
    deviceType: "laptop",
    brand: "Lenovo",
    originalPrice: 110000,
    price: 23499,
    discountPercentage: 78,
    grade: "Grade A+ (Certified)",
    rating: 4.8,
    reviewsCount: 96,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80"
    ],
    bestFor: "Software Engineers, Computer Science Students, Python/Java/Web Development, Linux Dual-Booting, and All-Day Mobile Productivity",
    suitability: ["coding", "college", "office", "laptop"],
    suitabilityBadge: "Best for Programming & College",
    highlights: [
      "Intel Core i7 8th Gen Quad-Core Processor (Up to 4.0 GHz Turbo)",
      "16GB DDR4 High-Speed RAM + 512GB Fast NVMe SSD",
      "Legendary Spill-Resistant Backlit Keyboard with Ergonomic TrackPoint",
      "Hot-Swappable Dual Battery System (8 to 10 Hours Continuous Backup)",
      "Military-Grade MIL-STD 810G Drop & Shock Tested Chassis"
    ],
    specs: {
      processor: "Intel Core i7-8550U (4 Cores, 8 Threads, up to 4.0 GHz)",
      ram: "16GB DDR4 (Expandable to 32GB)",
      storage: "512GB NVMe M.2 SSD",
      gpu: "Intel UHD Graphics 620",
      display: "14.0-inch Full HD (1920 x 1080) IPS Anti-glare Matte Panel",
      chassis: "Glass-Fiber Reinforced Composite + Magnesium Skeleton",
      ports: "Thunderbolt 3, USB-C, 2x USB 3.1, HDMI, RJ45 Gigabit Ethernet, SD Reader",
      battery: "Dual Battery Bridge (Internal + Swappable External 72Wh)",
      os: "Windows 11 Pro Genuine",
      weight: "1.58 kg"
    },
    inStock: 8,
    customizable: true
  },
  {
    id: "hp-elitebook-840-g6",
    name: "HP EliteBook 840 G6 Aluminum Business Ultrabook",
    shortName: "HP EliteBook 840 G6",
    badge: "✨ SLIM, LIGHT & STYLISH",
    category: "business",
    deviceType: "laptop",
    brand: "HP",
    originalPrice: 98000,
    price: 21999,
    discountPercentage: 77,
    grade: "Grade A+ (Mint Condition)",
    rating: 4.7,
    reviewsCount: 64,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
    ],
    bestFor: "Corporate Professionals, College Students, Daily Office Work, Zoom/Teams Video Conferences, Accounts, and Web Research",
    suitability: ["college", "office", "laptop"],
    suitabilityBadge: "Best for Office, Meetings & College",
    highlights: [
      "Intel Core i5 8th Gen vPro High-Efficiency Processor",
      "16GB DDR4 RAM + 256GB Fast NVMe SSD",
      "All-Aluminum Precision Unibody Chassis in Natural Platinum Silver",
      "Bang & Olufsen Premium Studio Tuned Audio Speakers",
      "HP Sure View Privacy Screen, HD Webcam & Fingerprint Sensor"
    ],
    specs: {
      processor: "Intel Core i5-8365U (4 Cores, 8 Threads, up to 4.10 GHz)",
      ram: "16GB DDR4",
      storage: "256GB NVMe SSD (Upgradable to 1TB)",
      gpu: "Intel UHD Graphics 620",
      display: "14.0-inch FHD (1920 x 1080) IPS Anti-Glare 400 nits",
      chassis: "CNC Anodized Aluminum Uni-structure",
      ports: "Thunderbolt, 2x USB 3.1, HDMI 1.4b, RJ45 Ethernet, Smart Card",
      battery: "HP Long Life 50Wh Li-ion with Fast Charging",
      os: "Windows 11 Pro Genuine",
      weight: "1.48 kg"
    },
    inStock: 11,
    customizable: true
  },
  {
    id: "dell-optiplex-7070-micro",
    name: "Dell OptiPlex 7070 Micro Mini Desktop PC",
    shortName: "Dell OptiPlex 7070 Micro PC",
    badge: "🖥️ COMPACT DESKTOP PC",
    category: "desktop",
    deviceType: "desktop",
    brand: "Dell",
    originalPrice: 85000,
    price: 22999,
    discountPercentage: 73,
    grade: "Grade A+ (Tested Certified)",
    rating: 4.8,
    reviewsCount: 42,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&auto=format&fit=crop&q=80"
    ],
    bestFor: "Office Reception, Chartered Accountants, Tally ERP 9 / Prime, Stock Market Multi-Screen Trading, and Compact Home Study Desks",
    suitability: ["office", "trading", "desktop"],
    suitabilityBadge: "Best Mini Desktop for Office & Trading",
    highlights: [
      "Intel Core i7-9700T 9th Gen 8-Core Desktop Processor",
      "16GB DDR4 RAM + 512GB Fast M.2 NVMe SSD",
      "Palm-Sized Ultra Compact Form Factor (Mounts cleanly behind any monitor)",
      "Supports Dual 4K External Monitors via Dual DisplayPorts",
      "Ultra-Quiet Heavy Steel Chassis with Low 35W Power Consumption"
    ],
    specs: {
      processor: "Intel Core i7-9700T (8 Cores, 8 Threads, up to 4.30 GHz Turbo, 12MB Cache)",
      ram: "16GB DDR4 (Expandable to 64GB)",
      storage: "512GB NVMe SSD + 2.5-inch SATA expansion slot",
      gpu: "Intel UHD Graphics 630 (Dual 4K Multi-Monitor Support)",
      display: "Desktop Unit (Connects to Any HDMI / DisplayPort / VGA Screen)",
      chassis: "Heavy-Gauge Commercial Steel Micro Chassis",
      ports: "1x USB-C, 5x USB 3.1, 2x DisplayPort 1.2, Gigabit Ethernet, Audio In/Out",
      battery: "External 65W High-Efficiency Power Adapter included",
      os: "Windows 11 Pro Genuine",
      weight: "1.18 kg"
    },
    inStock: 9,
    customizable: true
  },
  {
    id: "hp-elitedesk-800-tower",
    name: "HP EliteDesk 800 G4 Commercial Tower Workstation PC",
    shortName: "HP EliteDesk 800 G4 Tower",
    badge: "⚡ HEAVY OFFICE & TRADING TOWER",
    category: "desktop",
    deviceType: "desktop",
    brand: "HP",
    originalPrice: 95000,
    price: 24999,
    discountPercentage: 74,
    grade: "Grade A+ (Tested Certified)",
    rating: 4.8,
    reviewsCount: 38,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80"
    ],
    bestFor: "Multi-Screen Stock Trading (3 Displays), Tally ERP / GST Tax Filing, 24/7 Office Server Multi-tasking, and High-Throughput Data Entry",
    suitability: ["trading", "office", "desktop"],
    suitabilityBadge: "Best Heavy Tower for Office & Trading",
    highlights: [
      "Intel Core i7 8th Gen 6-Core High-Voltage Processor (Up to 4.60 GHz Turbo)",
      "16GB DDR4 RAM (Expandable to 64GB across 4 DIMM slots) + 512GB NVMe SSD + 1TB HDD",
      "Triple Display Output (Dual DisplayPort + HDMI) for 3 Simultaneous Monitors",
      "Heavy-Gauge Industrial Steel Tower with Tool-less Access & High-CFM Fan",
      "Genuine Windows 11 Pro Pre-installed with 6 Months Comprehensive Warranty"
    ],
    specs: {
      processor: "Intel Core i7-8700 (6 Cores / 12 Threads, 3.20 GHz up to 4.60 GHz Turbo)",
      ram: "16GB DDR4 (Expandable to 64GB)",
      storage: "512GB Fast NVMe SSD + 1TB Secondary HDD",
      gpu: "Intel UHD 630 + Dedicated PCIe Expansion (Triple Display Ready)",
      display: "Desktop Tower PC (Includes Power Cable & DisplayPort-to-HDMI Adapter)",
      chassis: "Heavy Commercial Steel Tower with Tool-less Access",
      ports: "USB Type-C, 6x USB 3.1, 2x DisplayPort, Gigabit LAN, Audio In/Out",
      battery: "Built-in 250W Platinum 92% Efficiency Power Supply",
      os: "Windows 11 Pro 64-bit Genuine Licensed",
      weight: "7.14 kg"
    },
    inStock: 7,
    customizable: true
  },
  {
    id: "hp-zbook-15-g5",
    name: "HP ZBook 15 G5 Heavy Mobile CAD Workstation",
    shortName: "HP ZBook 15 G5 Workstation",
    badge: "🏗️ 3D CAD & SOLIDWORKS HEAVYWEIGHT",
    category: "workstation",
    deviceType: "laptop",
    brand: "HP",
    originalPrice: 195000,
    price: 41999,
    discountPercentage: 78,
    grade: "Grade A+ (Workstation Grade)",
    rating: 4.8,
    reviewsCount: 39,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&auto=format&fit=crop&q=80"
    ],
    bestFor: "Mechanical/Civil Engineers, SolidWorks, Autodesk Revit, 3ds Max, Blender 3D, and Heavy Architectural Simulation Computing",
    suitability: ["cad", "editing", "laptop"],
    suitabilityBadge: "Best for Heavy 3D CAD & Engineering",
    highlights: [
      "Intel Core i7-8750H Hexa-Core (6 Cores / 12 Threads, 4.10 GHz Turbo)",
      "32GB Massive DDR4 RAM (4 Memory Slots, Up to 128GB)",
      "1TB NVMe High Performance SSD",
      "4GB Dedicated NVIDIA Quadro P2000 Pro Graphics (ISV Certified)",
      "Thermal Dual-Vapor Cooling Architecture for Sustained 100% Load"
    ],
    specs: {
      processor: "Intel Core i7-8750H (6 Cores, 2.2 GHz up to 4.1 GHz)",
      ram: "32GB DDR4 (Expandable to 128GB)",
      storage: "1TB NVMe SSD",
      gpu: "4GB Dedicated NVIDIA Quadro P2000 GDDR5",
      display: "15.6-inch FHD (1920 x 1080) IPS Ambient Light Sensor",
      chassis: "Magnesium-Aluminum Heavy-Duty Alloy",
      ports: "2x Thunderbolt 3, 3x USB 3.0, HDMI, RJ-45, Smart Card",
      battery: "90Wh HP Long Life 4-cell Polymer",
      os: "Windows 11 Pro 64-bit Genuine",
      weight: "2.60 kg"
    },
    inStock: 3,
    customizable: true
  },
  {
    id: "lenovo-legion-5-gaming",
    name: "Lenovo Legion 5 AMD Ryzen 7 RTX Gaming Rig",
    shortName: "Lenovo Legion 5 Gaming",
    badge: "🎮 GAMING & 3D RENDERING",
    category: "gaming",
    deviceType: "laptop",
    brand: "Lenovo",
    originalPrice: 105000,
    price: 49999,
    discountPercentage: 52,
    grade: "Grade A+ (Open-Box Like New)",
    rating: 4.9,
    reviewsCount: 51,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"
    ],
    bestFor: "High-FPS PC Gaming (GTA V, Valorant, Cyberpunk 2077), Unreal Engine 5, Ray-Tracing GPU Rendering, and Fast 4K Video Production",
    suitability: ["gaming", "rendering", "editing", "laptop"],
    suitabilityBadge: "Best for Gaming & 3D Rendering",
    highlights: [
      "AMD Ryzen 7 5800H Octa-Core Processor (8 Cores, 16 Threads, 4.40 GHz Turbo)",
      "16GB DDR4 3200MHz RAM + 512GB Gen3 NVMe SSD",
      "4GB NVIDIA GeForce RTX 3050 Dedicated Graphics with Ray Tracing",
      "15.6-inch 144Hz Smooth Display with Dolby Vision & 100% sRGB",
      "Legion Coldfront 3.0 Dual Fan Extreme Cooling"
    ],
    specs: {
      processor: "AMD Ryzen 7 5800H (8 Cores, 3.2 GHz up to 4.4 GHz)",
      ram: "16GB DDR4 3200MHz",
      storage: "512GB M.2 NVMe SSD",
      gpu: "4GB Dedicated NVIDIA RTX 3050 GDDR6 (95W TGP)",
      display: "15.6-inch FHD (1920x1080) IPS 144Hz, 300nits, Free-Sync",
      chassis: "Phantom Blue & Shadow Black PC-ABS Construction",
      ports: "4x USB 3.2, 2x USB-C 3.2 (DisplayPort 1.4), HDMI 2.1, RJ-45",
      battery: "60Wh Battery with Rapid Charge Pro",
      os: "Windows 11 Home Genuine",
      weight: "2.40 kg"
    },
    inStock: 4,
    customizable: true
  },
  {
    id: "macbook-pro-15-retina",
    name: "Apple MacBook Pro 15-inch Touch Bar (Space Grey)",
    shortName: "MacBook Pro 15 Retina",
    badge: "🍏 APPLE CREATIVE STUDIO",
    category: "creative",
    deviceType: "laptop",
    brand: "Apple",
    originalPrice: 220000,
    price: 48999,
    discountPercentage: 77,
    grade: "Grade A+ (Refurbished Certified)",
    rating: 4.9,
    reviewsCount: 82,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
    ],
    bestFor: "iOS App Developers (Xcode), UI/UX Designers (Figma/Sketch), Music Producers (Logic Pro), and Apple Ecosystem Aficionados",
    suitability: ["creative", "editing", "laptop"],
    suitabilityBadge: "Best for Apple Lovers & Designers",
    highlights: [
      "Intel 6-Core i7 Processor with Turbo Boost up to 4.1 GHz",
      "16GB High-Speed RAM + 512GB Ultra-Fast SSD",
      "4GB Radeon Pro 555X Dedicated Graphics Card",
      "15.4-inch Retina Display with True Tone Technology & Wide P3 Color",
      "Touch Bar with integrated Touch ID sensor & 4x Thunderbolt 3 Ports"
    ],
    specs: {
      processor: "Intel 6-Core i7 (8th Gen, 2.2 GHz up to 4.1 GHz)",
      ram: "16GB 2400MHz DDR4 onboard",
      storage: "512GB PCIe-based SSD",
      gpu: "Radeon Pro 555X with 4GB GDDR5 + Intel UHD 630",
      display: "15.4-inch Retina LED-backlit (2880 x 1800), 500 nits",
      chassis: "Precision Recycled Aluminum Unibody",
      ports: "4x Thunderbolt 3 (USB-C) ports with charging and DisplayPort",
      battery: "83.6Wh Lithium Polymer (Sub 250 cycles tested)",
      os: "macOS Sonoma / Ventura Freshly Restored",
      weight: "1.83 kg"
    },
    inStock: 4,
    customizable: false
  }
];

var CUSTOMER_REVIEWS = (typeof window !== 'undefined' && window.CUSTOMER_REVIEWS) ? window.CUSTOMER_REVIEWS : [
  {
    id: 1,
    name: "Vikram Malhotra",
    city: "Mumbai, Maharashtra",
    product: "Dell Precision 5530 4K",
    rating: 5,
    date: "3 days ago",
    comment: "Genuinely blown away by the condition! Screen has zero scratches and the 4K panel is stunning for Premiere Pro editing. The i7 H-series and 4GB NVIDIA handle 4K timelines without a hiccup. Classic Computers delivered it in 2 days with bubble-sealed packing.",
    verifiedPurchase: true
  },
  {
    id: 2,
    name: "Aman Preet Singh",
    city: "Chandigarh",
    product: "Dell Precision 5530 4K",
    rating: 5,
    date: "1 week ago",
    comment: "I checked battery health on HWMonitor right after delivery—it's at 94%! Truly Grade A+ as advertised. The carbon fiber palm rest looks brand new. Best deal at ₹34,999 compared to spending 1.5 lakhs on a new laptop.",
    verifiedPurchase: true
  },
  {
    id: 3,
    name: "Rohit Shinde",
    city: "Pune, Maharashtra",
    product: "ThinkPad T480",
    rating: 5,
    date: "2 weeks ago",
    comment: "Classic Computers team answered all my questions on WhatsApp (+91 94121 82786) and sent a live video of the unit before shipping. Received exact device shown in video. Dual batteries give me 8+ hours for coding!",
    verifiedPurchase: true
  }
];

if (typeof window !== 'undefined') {
  window.STORE_CONFIG = STORE_CONFIG;
  window.PRODUCTS = PRODUCTS;
  window.CUSTOMER_REVIEWS = CUSTOMER_REVIEWS;
  window.buildProductWhatsAppUrl = STORE_CONFIG.buildWhatsAppUrl.bind(STORE_CONFIG);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STORE_CONFIG, PRODUCTS, CUSTOMER_REVIEWS };
}

