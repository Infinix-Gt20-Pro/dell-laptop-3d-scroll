/**
 * Classic Computer - Refurbished Hub Data Store
 * Catalog of certified refurbished enterprise laptops, workstations, and desktops
 */

const STORE_CONFIG = {
  storeName: "Classic Computer",
  tagline: "India's Premier Certified Refurbished Laptops & Computers Hub",
  whatsappNumber: "919876543210", // Formatted WhatsApp contact
  supportEmail: "sales@classiccomputer.in",
  supportPhone: "+91 98765 43210",
  address: "Classic Computer Tech Park, Main Computer Market, Firozabad / New Delhi, India",
  features: {
    warrantyMonths: 6,
    replacementDays: 7,
    inspectionPoints: 30,
    freeDelivery: true
  }
};

const PRODUCTS = [
  {
    id: "dell-5530-flagship",
    name: "Dell Precision / Latitude 5530 Mobile Workstation",
    shortName: "Dell 5530 4K Workstation",
    badge: "⭐ FLAGSHIP BESTSELLER",
    category: "workstation",
    brand: "Dell",
    originalPrice: 185000,
    price: 34999,
    discountPercentage: 81,
    grade: "Grade A+ (Pristine Condition)",
    rating: 4.9,
    reviewsCount: 148,
    isFeatured: true,
    thumbnail: "assets/images/real-5530/dell_5530_front_display.jpg",
    images: [
      "assets/images/real-5530/dell_5530_front_display.jpg",
      "assets/images/real-5530/dell_5530_aluminium_lid.jpg",
      "assets/images/real-5530/dell_5530_4k_screen_detail.jpg",
      "assets/images/real-5530/dell_5530_angled_profile.jpg"
    ],
    highlights: [
      "Intel® Core™ i7-8850H 8th Gen H-Series Processor (6 Cores, 12 Threads)",
      "4GB Dedicated NVIDIA Quadro / GeForce Graphics + Intel UHD 630",
      "15.6-inch 4K UHD (3840 x 2160) UltraSharp™ Borderless Display",
      "Aircraft-Grade CNC Machined Aluminum Body & Carbon Fiber Deck",
      "Certified 30-Point Tested with 92% Battery Health Guaranteed"
    ],
    specs: {
      processor: "Intel Core i7-8850H (8th Gen H-Series, 2.60 GHz up to 4.30 GHz Turbo, 9MB Cache)",
      ram: "8GB DDR4 2666MHz (Dual Slot, Expandable up to 64GB)",
      storage: "256GB NVMe M.2 High-Speed SSD (Secondary M.2/SATA slot available)",
      gpu: "4GB Dedicated NVIDIA GPU + Intel UHD Graphics 630 (Dual Graphics Engine)",
      display: "15.6\" 4K Ultra HD (3840 x 2160) InfinityEdge, 100% AdobeRGB, 400 nits brightness",
      chassis: "Precision CNC Aluminum Lid & Base with Carbon-Fiber Composite Palmrest",
      ports: "2x USB 3.1 Gen 1 with PowerShare, 1x Thunderbolt 3 (USB-C), 1x HDMI 2.0, SD Card Reader, Audio Jack",
      battery: "Original OEM 97Wh Battery (Health checked 90%+), 130W Dell Slim Adapter included",
      os: "Windows 11 Pro 64-bit Genuine Licensed",
      weight: "1.78 kg (Ultra-portable workstation profile)"
    },
    inStock: 5,
    customizable: true
  },
  {
    id: "thinkpad-t480-classic",
    name: "Lenovo ThinkPad T480 Dual-Battery Ultrabook",
    shortName: "Lenovo ThinkPad T480",
    badge: "BUSINESS LEGEND",
    category: "business",
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
    highlights: [
      "Intel Core i7 8th Gen Quad-Core Processor",
      "16GB DDR4 RAM + 512GB Fast NVMe SSD",
      "Legendary Spill-Resistant Backlit Keyboard with TrackPoint",
      "Hot-Swappable Dual Battery Bridge System (Up to 10 hrs backup)",
      "Military-Grade MIL-STD 810G Durability"
    ],
    specs: {
      processor: "Intel Core i7-8550U (8th Gen, up to 4.0 GHz)",
      ram: "16GB DDR4",
      storage: "512GB NVMe SSD",
      gpu: "Intel UHD Graphics 620",
      display: "14.0\" Full HD (1920 x 1080) IPS Anti-glare",
      chassis: "Glass-Fiber Reinforced Plastic + Magnesium Base",
      ports: "Thunderbolt 3, USB-C, 2x USB 3.1, HDMI, RJ45 Gigabit, SD Reader",
      battery: "Dual Battery Bridge (Internal + Swappable External)",
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
    badge: "SLEEK & LIGHT",
    category: "business",
    brand: "HP",
    originalPrice: 98000,
    price: 21999,
    discountPercentage: 77,
    grade: "Grade A+ (Mint)",
    rating: 4.7,
    reviewsCount: 64,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
    ],
    highlights: [
      "Intel Core i5 8th Gen High-Efficiency Processor",
      "16GB DDR4 RAM + 256GB NVMe SSD",
      "All-Aluminum Precision Unibody Chassis in Natural Silver",
      "Bang & Olufsen Studio Tuned Audio System",
      "HP Sure View Privacy Screen & Fingerprint Sensor"
    ],
    specs: {
      processor: "Intel Core i5-8365U (8th Gen vPro, up to 4.1 GHz)",
      ram: "16GB DDR4",
      storage: "256GB NVMe SSD",
      gpu: "Intel UHD Graphics 620",
      display: "14\" FHD (1920 x 1080) IPS Anti-Glare 400 nits",
      chassis: "CNC Anodized Aluminum Uni-structure",
      ports: "Thunderbolt, 2x USB 3.1, HDMI 1.4b, RJ45, Smart Card",
      battery: "HP Long Life 3-cell 50Wh Li-ion",
      os: "Windows 11 Pro Genuine",
      weight: "1.48 kg"
    },
    inStock: 11,
    customizable: true
  },
  {
    id: "macbook-pro-15-retina",
    name: "Apple MacBook Pro 15\" Touch Bar (Space Grey)",
    shortName: "MacBook Pro 15 Retina",
    badge: "CREATIVE POWERHOUSE",
    category: "creative",
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
    highlights: [
      "Intel 6-Core i7 Processor with Turbo Boost up to 4.1 GHz",
      "16GB High-Speed RAM + 512GB Ultra-Fast SSD",
      "4GB Radeon Pro 555X Dedicated Graphics Card",
      "15.4\" Retina Display with True Tone Technology & Wide P3 Color",
      "Touch Bar with integrated Touch ID sensor & 4x Thunderbolt 3 Ports"
    ],
    specs: {
      processor: "Intel 6-Core i7 (8th Gen, 2.2 GHz up to 4.1 GHz)",
      ram: "16GB 2400MHz DDR4 onboard",
      storage: "512GB PCIe-based SSD",
      gpu: "Radeon Pro 555X with 4GB GDDR5 + Intel UHD 630",
      display: "15.4\" Retina LED-backlit (2880 x 1800), 500 nits",
      chassis: "Precision Recycled Aluminum Unibody",
      ports: "4x Thunderbolt 3 (USB-C) ports with charging and DisplayPort",
      battery: "83.6Wh Lithium Polymer (Sub 250 cycles tested)",
      os: "macOS Sonoma / Ventura Freshly Restored",
      weight: "1.83 kg"
    },
    inStock: 4,
    customizable: false
  },
  {
    id: "hp-zbook-15-g5",
    name: "HP ZBook 15 G5 Heavy Mobile CAD Workstation",
    shortName: "HP ZBook 15 G5 Workstation",
    badge: "CAD & 3D RENDERING",
    category: "workstation",
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
    highlights: [
      "Intel Core i7-8750H Hexa-Core (6 Cores / 12 Threads)",
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
      display: "15.6\" FHD (1920 x 1080) IPS Ambient Light Sensor",
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
    badge: "GAMING & EDITING",
    category: "gaming",
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
    highlights: [
      "AMD Ryzen™ 7 5800H Octa-Core Processor (8 Cores, 16 Threads)",
      "16GB DDR4 3200MHz RAM + 512GB Gen3 NVMe SSD",
      "4GB NVIDIA GeForce RTX 3050 Dedicated Graphics with Ray Tracing",
      "15.6\" 144Hz Smooth Display with Dolby Vision™ & 100% sRGB",
      "Legion Coldfront 3.0 Dual Fan Extreme Cooling"
    ],
    specs: {
      processor: "AMD Ryzen 7 5800H (8 Cores, 3.2 GHz up to 4.4 GHz)",
      ram: "16GB DDR4 3200MHz",
      storage: "512GB M.2 NVMe SSD",
      gpu: "4GB Dedicated NVIDIA RTX 3050 GDDR6 (95W TGP)",
      display: "15.6\" FHD (1920x1080) IPS 144Hz, 300nits, Free-Sync",
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
    id: "dell-optiplex-7070-micro",
    name: "Dell OptiPlex 7070 Micro Mini Desktop PC",
    shortName: "Dell OptiPlex 7070 Micro",
    badge: "OFFICE COMPACT HUB",
    category: "desktop",
    brand: "Dell",
    originalPrice: 85000,
    price: 22999,
    discountPercentage: 73,
    grade: "Grade A+ (Refurbished)",
    rating: 4.7,
    reviewsCount: 42,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&auto=format&fit=crop&q=80"
    ],
    highlights: [
      "Intel Core i7-9700T 9th Gen 8-Core Desktop Processor",
      "16GB DDR4 RAM + 512GB Fast M.2 NVMe SSD",
      "Palm-Sized Ultra Compact Form Factor (Mounts behind any monitor)",
      "Supports Dual 4K External Monitors via DisplayPorts",
      "Ultra-Quiet Operation with Low 35W Power Consumption"
    ],
    specs: {
      processor: "Intel Core i7-9700T (8 Cores, 2.0 GHz up to 4.3 GHz, 12MB Cache)",
      ram: "16GB DDR4 (Expandable to 64GB)",
      storage: "512GB NVMe SSD + 2.5\" HDD expansion bay",
      gpu: "Intel UHD Graphics 630 (Dual 4K Output)",
      display: "Desktop Unit (Connects to HDMI / DisplayPort screens)",
      chassis: "Heavy-Gauge Steel Micro Chassis",
      ports: "1x USB-C, 5x USB 3.1, 2x DisplayPort 1.2, Gigabit Ethernet, Audio In/Out",
      battery: "External 65W High-Efficiency Power Adapter included",
      os: "Windows 11 Pro Genuine",
      weight: "1.18 kg"
    },
    inStock: 9,
    customizable: true
  },
  {
    id: "dell-ultrasharp-27-4k",
    name: "Dell UltraSharp U2720Q 27\" 4K USB-C Designer Monitor",
    shortName: "Dell UltraSharp 27\" 4K",
    badge: "4K HDR PRO DISPLAY",
    category: "accessory",
    brand: "Dell",
    originalPrice: 65000,
    price: 18499,
    discountPercentage: 71,
    grade: "Grade A+ (Zero Dead Pixels)",
    rating: 4.9,
    reviewsCount: 33,
    isFeatured: false,
    thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ],
    highlights: [
      "27-inch 4K UHD (3840 x 2160) IPS Panel with VESA DisplayHDR 400",
      "99% sRGB & 95% DCI-P3 Color Accuracy with Delta-E < 2 factory calibration",
      "USB-C Single-Cable Hub with 90W Power Delivery for Laptops",
      "Fully Ergonomic Stand: Height, Tilt, Swivel, and Pivot 90° Rotation",
      "Original Box, Power Cable & High-Speed HDMI/Type-C Cable included"
    ],
    specs: {
      processor: "N/A - Monitor",
      ram: "N/A",
      storage: "N/A",
      gpu: "N/A",
      display: "27\" 4K UHD 3840x2160 @ 60Hz, 350 cd/m², 1300:1 Contrast Ratio",
      chassis: "Platinum Silver Ultra-Thin Bezel Frame",
      ports: "1x USB-C (90W PD), 1x DisplayPort 1.4, 1x HDMI 2.0, 3x USB 3.0 downstream",
      battery: "Built-in AC Power",
      os: "Plug & Play Compatible with Windows, Mac, Linux",
      weight: "4.4 kg (Panel only)"
    },
    inStock: 6,
    customizable: false
  }
];

const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: "Vikram Malhotra",
    city: "Mumbai, Maharashtra",
    product: "Dell Precision 5530 4K",
    rating: 5,
    date: "3 days ago",
    comment: "Genuinely blown away by the condition! Screen has zero scratches and the 4K panel is stunning for Premiere Pro editing. The i7 H-series and 4GB NVIDIA handle 4K timelines without a hiccup. Classic Computer delivered it in 2 days with bubble-sealed packing.",
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
    comment: "Classic Computer team answered all my questions on WhatsApp and sent live video of the unit before shipping. Received exact device shown in video. Dual batteries give me 8+ hours for coding!",
    verifiedPurchase: true
  }
];
