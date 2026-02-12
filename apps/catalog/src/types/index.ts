export type ProductCreatedEvent = {
  ProductId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
};
