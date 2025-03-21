import React, { useState } from 'react';
import { ShoppingCart, Tag, Package, Check, BarChart as ChartBar, Loader2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Домаћи Мед",
    description: "Природни мед из Заплања, 1кг",
    price: 250,
    stock: 15,
    image: "https://images.unsplash.com/photo-1644221362202-2e3e6b01d717?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIzfHxob25leXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    name: "Сир",
    description: "Традиционални сир из Заплања, 1кг",
    price: 300,
    stock: 8,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Прасићи",
    description: "Прасићи, 1кг",
    price: 250,
    stock: 5,
    image: "https://images.unsplash.com/photo-1586348323398-678d15d9e87f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHBpZ3xlbnwwfHwwfHx8Mg%3D%3D"
  },
  {
    id: 4,
    name: "Ракија",
    description: "Шљивовица из Заплања, 1л",
    price: 400,
    stock: 20,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800"
  }
];

const salesData = {
  labels: ['Јан', 'Феб', 'Мар', 'Апр', 'Мај', 'Јун'],
  datasets: [
    {
      label: 'Продаја (ЗПЛ)',
      data: [1200, 1900, 3000, 5000, 4000, 3000],
      backgroundColor: 'rgba(147, 51, 234, 0.5)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 1,
    },
  ],
};

const productShareData = {
  labels: ['Мед', 'Сир', 'Прасићи', 'Ракија'],
  datasets: [
    {
      data: [30, 25, 25, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'white',
      },
    },
    title: {
      display: true,
      color: 'white',
    },
  },
  scales: {
    y: {
      ticks: {
        color: 'white',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    x: {
      ticks: {
        color: 'white',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'white',
      },
    },
  },
};

export default function Marketplace() {
  const [balance, setBalance] = useState(1234.56);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [availableProducts, setAvailableProducts] = useState(products);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert('Нема више на стању!');
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product || newQuantity > product.stock) {
      alert('Нема довољно производа на стању!');
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePurchase = () => {
    if (purchaseStatus === 'processing') return;

    const totalPrice = getTotalPrice();
    if (totalPrice > balance) {
      alert('Немате довољно средстава за куповину!');
      return;
    }

    setPurchaseStatus('processing');
    
    setTimeout(() => {
      setAvailableProducts(prevProducts =>
        prevProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          return cartItem
            ? { ...product, stock: product.stock - cartItem.quantity }
            : product;
        })
      );

      setBalance(prev => prev - totalPrice);

      setPurchaseStatus('success');
      setPurchaseComplete(true);
      
      setTimeout(() => {
        setPurchaseComplete(false);
        setShowCart(false);
        setCart([]);
        setPurchaseStatus('idle');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Заплањска Пијаца</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <ChartBar className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableProducts.map(product => (
            <div key={product.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center text-purple-400">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{product.price} ЗПЛ</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      На стању: {product.stock}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock === 0 ? 'Распродато' : 'Додај у корпу'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showStats && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6">Статистика Продаје</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">Месечна Продаја</h4>
              <Bar options={chartOptions} data={salesData} />
            </div>
            <div className="bg-white/5 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-white mb-4">Удео Производа</h4>
              <Pie options={pieOptions} data={productShareData} />
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Корпа</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300">Ваша корпа је празна</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-purple-400">{item.price} ЗПЛ × {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Уклони
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white">Укупно:</span>
                    <span className="text-xl font-bold text-purple-400">{getTotalPrice()} ЗПЛ</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    Стање новчаника: {balance.toFixed(2)} ЗПЛ
                  </div>
                  <button
                    onClick={handlePurchase}
                    disabled={purchaseStatus === 'processing' || getTotalPrice() > balance}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {purchaseStatus === 'processing' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Обрада...</span>
                      </>
                    ) : purchaseStatus === 'success' ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Успешно!</span>
                      </>
                    ) : getTotalPrice() > balance ? (
                      <span>Недовољно средстава</span>
                    ) : (
                      <span>Плати са ЗПЛ</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {purchaseComplete && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg flex items-center space-x-2 animate-bounce">
            <Check className="h-5 w-5" />
            <span>Куповина успешна!</span>
          </div>
        </div>
      )}
    </div>
  );
}