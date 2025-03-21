import React, { useState } from 'react';
import { BarChart, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'white',
      },
    },
  },
  scales: {
    y: {
      ticks: { color: 'white' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
    },
    x: {
      ticks: { color: 'white' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
    },
  },
};

const transactionData = {
  labels: ['Јан', 'Феб', 'Мар', 'Апр', 'Мај', 'Јун'],
  datasets: [
    {
      label: 'Послато',
      data: [300, 450, 320, 500, 420, 350],
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1,
    },
    {
      label: 'Примљено',
      data: [400, 300, 450, 380, 460, 400],
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1,
    },
  ],
};

const balanceData = {
  labels: ['1', '5', '10', '15', '20', '25', '30'],
  datasets: [
    {
      fill: true,
      label: 'Стање',
      data: [1000, 1200, 1150, 1300, 1250, 1400, 1350],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      tension: 0.4,
    },
  ],
};

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('statistics');

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex space-x-4 mb-6">
        <TabButton
          icon={<BarChart />}
          label="Статистика Трансакција"
          active={activeTab === 'statistics'}
          onClick={() => setActiveTab('statistics')}
        />
        <TabButton
          icon={<Clock />}
          label="Историја Трансакција"
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        />
      </div>

      <div className="mt-6">
        {activeTab === 'statistics' && <StatisticsContent />}
        {activeTab === 'history' && <HistoryContent />}
      </div>
    </div>
  );
}

function StatisticsContent() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Укупно Трансакција" 
          value="1,234" 
          trend="+12.5%"
          isPositive={true}
        />
        <StatCard 
          title="Месечни Промет" 
          value="456.78 ЗПЛ" 
          trend="+8.3%"
          isPositive={true}
        />
        <StatCard 
          title="Просечна Трансакција" 
          value="45.6 ЗПЛ" 
          trend="-2.1%"
          isPositive={false}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Месечне Трансакције</h3>
          <Bar options={chartOptions} data={transactionData} />
        </div>
        <div className="bg-white/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Кретање Стања</h3>
          <Line options={chartOptions} data={balanceData} />
        </div>
      </div>
    </div>
  );
}

function HistoryContent() {
  const transactions = [
    { 
      id: 1, 
      type: 'send', 
      amount: '100 ЗПЛ', 
      to: 'Марко П.', 
      date: '12.03.2024',
      time: '14:23',
      status: 'completed'
    },
    { 
      id: 2, 
      type: 'receive', 
      amount: '50 ЗПЛ', 
      from: 'Јована С.', 
      date: '11.03.2024',
      time: '09:45',
      status: 'completed'
    },
    { 
      id: 3, 
      type: 'mining', 
      amount: '100 ЗПЛ', 
      date: '10.03.2024',
      time: '22:15',
      status: 'completed'
    },
  ];

  return (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <div key={transaction.id} className="bg-white/5 p-4 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              transaction.type === 'send' 
                ? 'bg-red-500/20 text-red-500' 
                : transaction.type === 'receive'
                ? 'bg-green-500/20 text-green-500'
                : 'bg-purple-500/20 text-purple-500'
            }`}>
              {transaction.type === 'send' && <ArrowUpRight className="h-5 w-5" />}
              {transaction.type === 'receive' && <ArrowDownRight className="h-5 w-5" />}
              {transaction.type === 'mining' && <TrendingUp className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-white font-medium">
                {transaction.type === 'send' && `Послато: ${transaction.amount} → ${transaction.to}`}
                {transaction.type === 'receive' && `Примљено: ${transaction.amount} од ${transaction.from}`}
                {transaction.type === 'mining' && `Рударење: ${transaction.amount}`}
              </p>
              <p className="text-gray-400 text-sm">
                {transaction.date} у {transaction.time}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            transaction.status === 'completed' 
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {transaction.status === 'completed' ? 'Завршено' : 'У обради'}
          </div>
        </div>
      ))}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
}

function StatCard({ title, value, trend, isPositive }: StatCardProps) {
  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <h4 className="text-gray-300 text-sm">{title}</h4>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <div className={`flex items-center mt-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />}
        <span className="text-sm">{trend}</span>
      </div>
    </div>
  );
}

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function TabButton({ icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-white/20 text-white'
          : 'text-gray-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}