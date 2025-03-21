import React, { useState } from 'react';
import { Wallet, Minimize as Mining, QrCode, Copy, ArrowRight, Check, Loader2, Trophy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Confetti from 'react-confetti';
import { useWallet } from '../hooks/useWallet';

export default function WalletView() {
  const { walletAddress, loading: walletLoading, error: walletError } = useWallet();
  const [activeTab, setActiveTab] = useState('wallet');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [balance, setBalance] = useState(1234.56);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleCopyAddress = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartMining = () => {
    if (isMining) return;
    
    setIsMining(true);
    setMiningProgress(0);

    const interval = setInterval(() => {
      setMiningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMining(false);
          setShowCelebration(true);
          setBalance(prev => prev + 100);
          setTimeout(() => setShowCelebration(false), 5000);
          return 0;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendAmount || !recipientAddress) return;

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      alert('Неисправан износ');
      return;
    }

    setTransactionStatus('processing');

    setTimeout(() => {
      setBalance(prev => prev - amount);
      setTransactionStatus('success');
      setTimeout(() => {
        setTransactionStatus('idle');
        setShowSendModal(false);
        setSendAmount('');
        setRecipientAddress('');
      }, 2000);
    }, 2000);
  };

  if (walletLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
        <p className="text-red-400">Error: {walletError}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      {showCelebration && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center animate-bounce">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Честитамо!</h3>
              <p className="text-xl text-green-400">Зарадили сте 100 ЗПЛ</p>
            </div>
          </div>
        </>
      )}

      <div className="flex space-x-4 mb-6">
        <TabButton
          icon={<Wallet />}
          label="Новчаник"
          active={activeTab === 'wallet'}
          onClick={() => setActiveTab('wallet')}
        />
        <TabButton
          icon={<Mining />}
          label="Рударење"
          active={activeTab === 'mining'}
          onClick={() => setActiveTab('mining')}
        />
        <TabButton
          icon={<QrCode />}
          label="QR Код"
          active={activeTab === 'qr'}
          onClick={() => setActiveTab('qr')}
        />
      </div>

      <div className="mt-6">
        {activeTab === 'wallet' && (
          <WalletContent 
            balance={balance}
            onSend={() => setShowSendModal(true)} 
            onReceive={() => setShowReceiveModal(true)} 
          />
        )}
        {activeTab === 'mining' && (
          <MiningContent 
            isMining={isMining}
            progress={miningProgress}
            onStartMining={handleStartMining}
          />
        )}
        {activeTab === 'qr' && walletAddress && <QRContent walletAddress={walletAddress} />}
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Пошаљи ЗПЛ</h3>
              <button 
                onClick={() => setShowSendModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendMoney} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Адреса Примаоца
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="zpk_..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Износ (ЗПЛ)
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  max={balance}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={transactionStatus === 'processing'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {transactionStatus === 'processing' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Обрада...</span>
                  </>
                ) : transactionStatus === 'success' ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Успешно!</span>
                  </>
                ) : (
                  <>
                    <span>Пошаљи</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && walletAddress && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Прими ЗПЛ</h3>
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ваша Адреса Новчаника
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={walletAddress}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                  <button
                    onClick={handleCopyAddress}
                    className="bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-colors"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5 text-gray-300" />}
                  </button>
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-lg flex items-center justify-center">
                <QRCodeSVG 
                  value={walletAddress}
                  size={192}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin={false}
                />
              </div>
              <p className="text-center text-gray-300 text-sm">
                Поделите ову адресу са пошиљаоцем или им покажите QR код
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface WalletContentProps {
  balance: number;
  onSend: () => void;
  onReceive: () => void;
}

function WalletContent({ balance, onSend, onReceive }: WalletContentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{balance.toFixed(2)} ЗПЛ</h2>
        <p className="text-gray-300">Тренутно стање</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onSend}
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Пошаљи</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <button 
          onClick={onReceive}
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Прими
        </button>
      </div>
    </div>
  );
}

interface MiningContentProps {
  isMining: boolean;
  progress: number;
  onStartMining: () => void;
}

function MiningContent({ isMining, progress, onStartMining }: MiningContentProps) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-semibold text-white">Рударење</h3>
      <p className="text-gray-300">
        Зарадите ЗаплањеКоине помажући у одржавању мреже
      </p>
      
      {isMining ? (
        <div className="space-y-4">
          <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-purple-400">Рударење у току... {progress}%</p>
          <div className="animate-spin inline-block">
            <Loader2 className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      ) : (
        <button 
          onClick={onStartMining}
          className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2 mx-auto"
        >
          <span>Започни Рударење</span>
          <Mining className="h-5 w-5" />
        </button>
      )}

      {isMining && (
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-sm text-gray-300">
            Награда за успешно рударење: <span className="text-purple-400 font-semibold">100 ЗПЛ</span>
          </p>
        </div>
      )}
    </div>
  );
}

interface QRContentProps {
  walletAddress: string;
}

function QRContent({ walletAddress }: QRContentProps) {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-semibold text-white">QR Код Вашег Новчаника</h3>
      <div className="bg-white p-8 rounded-lg inline-block">
        <QRCodeSVG 
          value={walletAddress}
          size={256}
          bgColor="#ffffff"
          fgColor="#000000"
          level="L"
          includeMargin={false}
        />
      </div>
      <p className="text-gray-300">
        Скенирајте овај код да бисте брзо поделили адресу вашег новчаника
      </p>
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