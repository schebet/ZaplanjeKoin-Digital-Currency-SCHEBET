import React, { useState } from 'react';
import { CheckCircle, Copy, Check } from 'lucide-react';

export default function JoinSystem() {
  const [copied, setCopied] = useState(false);
  const joinLink = 'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--5a421e5b.local-credentialless.webcontainer-api.io';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Добродошли у Заплање-коин
      </h2>
      
      <p className="text-gray-300 mb-8 text-center">
        Заплање-коин је децентрализована дигитална валута намењена локалној заједници.
      </p>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold text-white mb-4">Како се прикључити?</h3>
          <div className="bg-white/5 p-6 rounded-lg">
            <p className="text-gray-300 mb-4">Отворите линк у вашем прегледачу:</p>
            <div className="flex items-center space-x-2">
              <code className="block bg-black/30 p-4 rounded-lg text-green-400 break-all flex-1">
                {joinLink}
              </code>
              <button
                onClick={handleCopyLink}
                className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors flex-shrink-0"
                title="Копирај линк"
              >
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5 text-gray-300" />}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">Први кораци</h3>
          <div className="space-y-4">
            <StepItem>
              Када отворите апликацију, аутоматски ће вам бити креиран новчаник са почетним стањем од 0 ЗПЛ
            </StepItem>
            <StepItem>
              Рударите нове блокове (награда: 100 ЗПЛ)
            </StepItem>
            <StepItem>
              Примите Заплање-коине од других корисника
            </StepItem>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">Сигурност</h3>
          <p className="text-gray-300">
            Ваш новчаник је јединствен и сигуран. Сачувајте адресу вашег новчаника на сигурном месту. 
            Све трансакције су трајно забележене у блокчејну и не могу се изменити.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">Следећи кораци</h3>
          <div className="space-y-4">
            <StepItem>Идите на страницу "Новчаник" да видите вашу адресу</StepItem>
            <StepItem>Започните рударење да зарадите ваше прве Заплање-коине</StepItem>
            <StepItem>Пошаљите Заплање-коине другим корисницима</StepItem>
          </div>
        </section>
      </div>
    </div>
  );
}

interface StepItemProps {
  children: React.ReactNode;
}

function StepItem({ children }: StepItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
      <p className="text-gray-300">{children}</p>
    </div>
  );
}