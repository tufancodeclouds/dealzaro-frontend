import {
  createContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type {
  ProductType,
  CartItemsType,
  ShopContextType,
} from "../types/ShopContext.types";

export const ShopContext = createContext<ShopContextType | null>(null);

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItemsType>({});
  const [products, setProducts] = useState<ProductType[]>([]);
  const [token, setToken] = useState<string>("");
  const navigate = useNavigate();

  const saveGuestCart = (cartData: CartItemsType) => {
    localStorage.setItem("guest_cart", JSON.stringify(cartData));
  };

  const loadGuestCart = (): CartItemsType => {
    const savedCart = localStorage.getItem("guest_cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return {};
      }
    }
    return {};
  };

  const addToCart = async (itemId: string, size: string) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const cartData: CartItemsType = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { token } }
        );
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      }
    } else {
      saveGuestCart(cartData);
    }
  };

  const updateQuantity = async (
    itemId: string,
    size: string,
    quantity: number
  ) => {
    const cartData: CartItemsType = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      }
    } else {
      saveGuestCart(cartData);
    }
  };

  const getCartCount = (): number => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const count = cartItems[itemId][size];
        if (count > 0) {
          totalCount += count;
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = (): number => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((p) => p._id === itemId);
      if (!itemInfo) continue;
      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products.reverse());
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token: string) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setCartItems(res.data.cartData);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const mergeGuestCart = async (guestCart: CartItemsType, token: string) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/merge`,
        { cart: guestCart },
        { headers: { token } }
      );
      if (res.data.success) {
        localStorage.removeItem("guest_cart");
        getUserCart(token);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.error("Error merging guest cart:", error);
      toast.error("Failed to merge guest cart.");
    }
  };

  const handleLogin = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const guestCart = localStorage.getItem("guest_cart");
    if (guestCart) {
      await mergeGuestCart(JSON.parse(guestCart), newToken);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const guestCart = loadGuestCart();

    if (!token && storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    } else if (!token && Object.keys(guestCart).length > 0) {
      setCartItems(guestCart);
    }

    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = useMemo<ShopContextType>(
    () => ({
      products,
      currency,
      delivery_fee,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      cartItems,
      addToCart,
      setCartItems,
      getCartCount,
      updateQuantity,
      getCartAmount,
      navigate,
      backendUrl,
      setToken,
      token,
      handleLogin,
    }),
    [
      products,
      search,
      showSearch,
      cartItems,
      token,
      navigate,
      backendUrl,
      currency,
      delivery_fee,
    ]
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
