export interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "ASUS Monitor",
    price: 12000,
  },
  {
    id: 2,
    name: "Logitech Mouse",
    price: 1500,
  },
];

export default products;
