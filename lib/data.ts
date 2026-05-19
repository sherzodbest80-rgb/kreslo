export const siteConfig = {
  name: "Damber",
  domain: "damber.uz",
  phone: "+998 20 001 53 13",
  phoneRaw: "+998200015313",
  telegram: "https://t.me/damber_uz",
  instagram: "https://instagram.com/damber.uz",
  youtube: "#",
  // n8n webhook URL — bu yerga o'zingizning n8n webhook URL'ini qo'yasiz
  webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL || "",
};

export type Product = {
  id: string;
  series: string;
  name: string;
  description: string;
  price: number; // so'mda
  priceUSD: number;
  image: string;
  features: string[];
  bgColor: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "premium-3d",
    series: "PREMIUM SERIES",
    name: "3D Zero Gravity",
    description: "Boshdan oyoqgacha to'liq massaj, planshet boshqaruvi bilan",
    price: 16900000,
    priceUSD: 1400,
    image: "/products/model-1.jpg",
    bgColor: "bg-damber-light",
    badge: "BESTSELLER",
    features: [
      "Zero Gravity rejim",
      "3D tana skanerlash",
      "Issiqlik terapiyasi",
      "LCD planshet pult",
    ],
  },
  {
    id: "elegant-comfort",
    series: "ELEGANT SERIES",
    name: "Elegant Comfort",
    description: "Zamonaviy dizayn va qulaylik, uy interyeriga mos krem rang",
    price: 14500000,
    priceUSD: 1200,
    image: "/products/model-2.jpg",
    bgColor: "bg-[#FAF6F0]",
    features: [
      "SL-shape relslari",
      "Avtomatik massaj rejimlari",
      "Oyoq-boldir massaji",
      "Smartphone uchun joy",
    ],
  },
];

export const formatPrice = (price: number): string => {
  return price.toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";
};
