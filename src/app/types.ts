export type ProductItem = {
    imageUrl: string;
    coverImage: string;
    productName: string;
    productBrand: string;
    productPrice: string;
    inStock: number;
    sales: number;
    id: string;
    productId: string;
    productDescription: string;
    category: {
      id: string;
      name: string;
    }
  };
  

  export interface heroSlider {
    img: string,
    text: string,
    subtext: string
}