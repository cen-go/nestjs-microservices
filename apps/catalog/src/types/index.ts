export type ProductCreatedEvent = {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
};
