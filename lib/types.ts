export type Spec = { k: string; v: string };

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  price: number;
  description: string;
  category: string;
  model3d: string;
  colors: string[];
  specs: Spec[];
  featured: boolean;
};

export type UserDTO = {
  id: string;
  email: string;
  name: string;
};

export type OrderItemDTO = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  nameEn: string;
  model3d: string;
  quantity: number;
  unitPrice: number;
  color: string | null;
};

export type OrderDTO = {
  id: string;
  total: number;
  status: string;
  recipient: string;
  address: string;
  createdAt: string;
  items: OrderItemDTO[];
};
