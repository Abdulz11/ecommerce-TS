type ProductDetail = {
  id: string;
  name: string;
  description: string;
  imageUrls?: string[];
  price?: number | { raw: number; formatted_with_symbol?: string };
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
