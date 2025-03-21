import React, { useState } from 'react';
import { TrendingUp, Users, Shield, X, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appLink = 'https://schebet-koin.netlify.app/';

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Заплање-коин</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Децентрализовани систем дигиталне валуте намењен за заједницу до 200 корисника.
          Свака трансакција је сигурна и непроменљива захваљујући блокчејн технологији.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <FeatureCard
          icon={<Shield className="h-8 w-8 text-emerald-400" />}
          title="Сигурност Система"
          description="Напредни криптографски алгоритми штите сваку трансакцију. Блокчејн технологија осигурава непроменљивост података."
        />
        <FeatureCard
          icon={<Users className="h-8 w-8 text-blue-400" />}
          title="Локална Заједница"
          description="Дизајниран за заједницу до 200 корисника, фокусиран на једноставност коришћења и ефикасност."
        />
        <FeatureCard
          icon={<TrendingUp className="h-8 w-8 text-purple-400" />}
          title="Транспарентност"
          description="Све трансакције су јавно видљиве и проверљиве, обезбеђујући потпуну транспарентност система."
        />
        <FeatureCard
          icon={<QrCode className="h-8 w-8 text-yellow-400" />}
          title="Брзо Придруживање"
          description={
            <div className="space-y-2">
              <p>Скенирајте QR код да бисте приступили апликацији:</p>
              <div className="flex justify-center bg-white p-2 rounded-lg">
                <QRCodeSVG 
                  value={appLink}
                  size={100}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin={false}
                />
              </div>
            </div>
          }
        />
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          Сазнајте више
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">О Заплање-коину</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 text-gray-300">
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Технологија</h3>
                <p>
                  Заплање-коин користи модерну блокчејн технологију прилагођену потребама локалне заједнице.
                  Систем је оптимизован за брзе трансакције и минималну потрошњу ресурса, што га чини идеалним
                  за свакодневну употребу.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Сигурност и Приватност</h3>
                <p>
                  Свака трансакција је заштићена напредним криптографским алгоритмима. Корисници имају потпуну
                  контролу над својим средствима, док систем обезбеђује транспарентност и непроменљивост свих
                  трансакција.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Рударење и Награде</h3>
                <p>
                  Корисници могу зарадити Заплање-коине кроз процес рударења, помажући у одржавању мреже.
                  За сваки успешно додат блок, рудар добија награду од 100 ЗПЛ. Систем је дизајниран тако
                  да рударење буде доступно свим корисницима, без потребе за специјализованом опремом.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Предности Система</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Брзе и сигурне трансакције између корисника</li>
                  <li>Минимални трошкови одржавања система</li>
                  <li>Једноставан кориснички интерфејс</li>
                  <li>Потпуна транспарентност свих трансакција</li>
                  <li>Аутоматско креирање новчаника за нове кориснике</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Техничке Спецификације</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Максимални број корисника: 200</li>
                  <li>Време између блокова: 5 минута</li>
                  <li>Награда за рударење: 100 ЗПЛ</li>
                  <li>Алгоритам консензуса: Proof of Work (прилагођен за малу мрежу)</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <div className="text-gray-300">{description}</div>
    </div>
  );
}