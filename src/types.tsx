type ProductDetail = {
  id: string;
  name: string;
  description: string;
  imageUrls?: string[];
  price?: number;
  currency?: string;
  quantity?: number;
  subCategory?: {
    name: string;
    category: {
      name: string;
    };
  };
  tag?: string[];
};

type ProfileData = {
  id: string;
  name: string;
  img?: string;
  email?: string;
  whatsapp: string;
  location: string;
  description: string;
};

export type { ProductDetail, ProfileData };
