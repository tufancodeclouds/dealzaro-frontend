import React, { useContext, useState, FormEvent, ChangeEvent } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
}

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  image: string[];
  size?: string;
  quantity?: number;
}

type CartItems = {
  [productId: string]: {
    [size: string]: number;
  };
};

const PlaceOrder: React.FC = () => {
  const [method, setMethod] = useState<'cod' | 'stripe' | 'razorpay'>('cod');
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response: any) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate('/orders');
            setCartItems({});
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || 'Payment verification failed');
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const orderItems: ProductItem[] = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const quantity = cartItems[productId][size];
          if (quantity > 0) {
            const product = products.find((p) => p._id === productId);
            if (product) {
              orderItems.push({
                ...structuredClone(product),
                size,
                quantity,
              });
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      if (!token) {
        toast.error('Please login first!');
        return;
      }

      switch (method) {
        case 'cod': {
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case 'stripe': {
          const response = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            const { session_url } = response.data;
            window.location.replace(session_url);
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case 'razorpay': {
          const response = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            initPay(response.data.order);
          } else {
            toast.error('Failed to initialize Razorpay payment');
          }
          break;
        }

        default:
          break;
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Order failed');
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]'
    >
      {/* Left */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1='DELIVERY' text2='INFORMATION' />
        </div>
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='firstName'
            value={formData.firstName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='First name'
          />
          <input
            required
            onChange={onChangeHandler}
            name='lastName'
            value={formData.lastName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Last name'
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name='email'
          value={formData.email}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='email'
          placeholder='Email address'
        />
        <input
          required
          onChange={onChangeHandler}
          name='street'
          value={formData.street}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='text'
          placeholder='Street'
        />
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='city'
            value={formData.city}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='City'
          />
          <input
            onChange={onChangeHandler}
            name='state'
            value={formData.state}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='State'
          />
        </div>
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='zipcode'
            value={formData.zipcode}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Zipcode'
          />
          <input
            required
            onChange={onChangeHandler}
            name='country'
            value={formData.country}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Country'
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name='phone'
          value={formData.phone}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='tel'
          placeholder='Phone'
        />
      </div>

      {/* Right */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1='PAYMENT' text2='METHOD' />

          <div className='flex gap-3 flex-col lg:flex-row'>
            <div
              onClick={() => setMethod('stripe')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'stripe' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt='Stripe' />
            </div>

            <div
              onClick={() => setMethod('razorpay')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt='Razorpay' />
            </div>

            <div
              onClick={() => setMethod('cod')}
              className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
