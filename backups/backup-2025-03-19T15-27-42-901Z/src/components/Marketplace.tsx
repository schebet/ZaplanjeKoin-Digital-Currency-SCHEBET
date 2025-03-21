import React, { useState } from 'react';
import { ShoppingCart, Tag, Package, Check, BarChart as ChartBar } from 'lucide-react';
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
}

const products: Product[] = [
  {
    id: 1,
    name: "Домаћи Мед",
    description: "Природни мед из Заплања, 1кг",
    price: 250,
    image: "https://images.unsplash.com/photo-1644221362202-2e3e6b01d717?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIzfHxob25leXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    name: "Сир",
    description: "Традиционални сир из Заплања, 1кг",
    price: 300,
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Прасићи",
    description: "Прасићи, 1кг",
    price: 250,
    image: "https://images.unsplash.com/photo-1586348323398-678d15d9e87f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHBpZ3xlbnwwfHwwfHx8Mg%3D%3D"
  },
  {
    id: 4,
    name: "Ракија",
    description: "Шљивовица из Заплања, 1л",
    price: 400,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800"
  }
];

// Пример података за графиконе
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
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handlePurchase = () => {
    setPurchaseComplete(true);
    setTimeout(() => {
      setPurchaseComplete(false);
      setCart([]);
      setShowCart(false);
    }, 3000);
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
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
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
                  <div className="flex items-center text-purple-400">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{product.price} ЗПЛ</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors text-sm"
                  >
                    Додај у корпу
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Статистика */}
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

      {/* Корпа Modal */}
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
                    <div>
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-purple-400">{item.price} ЗПЛ</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Уклони
                    </button>
                  </div>
                ))}

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white">Укупно:</span>
                    <span className="text-xl font-bold text-purple-400">{getTotalPrice()} ЗПЛ</span>
                  </div>

                  <button
                    onClick={handlePurchase}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Плати са ЗПЛ</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Потврда куповине */}
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