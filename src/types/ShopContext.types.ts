export interface ProductType {
    _id: string;
    name: string;
    price: number;
    [key: string]: any; // Extendable
  }
  
  export interface CartItemsType {
    [productId: string]: {
      [size: string]: number;
    };
  }
  
  export interface ShopContextType {
    products: ProductType[];
    currency: string;
    delivery_fee: number;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    showSearch: boolean;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    cartItems: CartItemsType;
    addToCart: (itemId: string, size: string) => Promise<void>;
    setCartItems: React.Dispatch<React.SetStateAction<CartItemsType>>;
    getCartCount: () => number;
    updateQuantity: (itemId: string, size: string, quantity: number) => Promise<void>;
    getCartAmount: () => number;
    navigate: (path: string) => void;
    backendUrl: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    token: string;
    handleLogin: (newToken: string) => Promise<void>;
  }
  