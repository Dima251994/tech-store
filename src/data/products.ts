import type { Product } from "../types/product";

const products: Product[] = [
  {
    id: 1,
    name: "Ноутбук ASUS ProArt Studiobook",
    description:
      "16-дюймовий OLED дисплей, процесор Intel Core i9, 32 ГБ ОЗП, SSD 1 ТБ для роботи з графікою та кодом.",
    price: 78999.0,
    category: "Ноутбуки",
    image: "https://samplelib.com/jpeg/sample-photo-3840x2160.jpg",
    inStock: true,
    stockQuantity: 5,
    specifications: {
      Процесор: "Intel Core i9",
      "Оперативна пам'ять": "32 GB",
      Накопичувач: "1 TB SSD",
      "Діагональ екрана": "16 дюймів",
    },
  },
  {
    id: 2,
    name: "Бездротові навушники Sony WH-1000XM5",
    description:
      "Преміальні навушники з передовим активним шумозаглушенням та автономністю до 30 годин.",
    price: 14500.0,
    category: "Аудіо",
    image: "https://samplelib.com/jpeg/sample-photo-3840x2160.jpg",
    inStock: true,
    stockQuantity: 10,
    specifications: {
      "Тип навушників": "Повнорозмірні",
      "Тип підключення": "Бездротові (Bluetooth 5.2)",
      "Активне шумозаглушення (ANC)": "Є",
      "Час автономної роботи": "До 30 годин",
      "Роз'єм для зарядки": "USB Type-C",
    },
  },
  {
    id: 3,
    name: "Смартфон Samsung Galaxy S24 Ultra",
    description:
      "Флагманський смартфон із підтримкою S Pen, камерою 200 Мп та дисплеєм Dynamic AMOLED 2X.",
    price: 49999.0,
    category: "Смартфони",
    image: "https://samplelib.com/jpeg/sample-photo-3840x2160.jpg",
    inStock: false,
    stockQuantity: 0,
    specifications: {
      "Діагональ екрана": "6.8 дюйма",
      "Основна камера": "200 Мп + 50 Мп + 12 Мп + 10 Мп",
      "Оперативна пам'ять": "12 GB",
      "Вбудована пам'ять": "512 GB",
      "Ємність акумулятора": "5000 мАг",
    },
  },
  {
    id: 4,
    name: "Механічна клавіатура Keychron K2 V2",
    description:
      "Бездротова компактна клавіатура на перемикачах Gateron Brown із RGB-підсвічуванням.",
    price: 3800.0,
    category: "Периферія",
    image: "https://samplelib.com/jpeg/sample-photo-3840x2160.jpg",
    inStock: true,
    stockQuantity: 15,
  },
  {
    id: 5,
    name: 'Монітор Dell UltraSharp 27" 4K',
    description:
      "Професійний IPS-монітор із точним охопленням кольорів sRGB 100% та портів USB-C Hub.",
    price: 21500.0,
    category: "Монітори",
    image: "https://samplelib.com/jpeg/sample-photo-3840x2160.jpg",
    inStock: true,
    stockQuantity: 7,
  },
];

export default products;
