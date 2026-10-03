import React from 'react';
import { TrendingUp, CheckCircle2, Clock3 } from 'lucide-react';

const ProgressSection = () => {
  const progress = 0;

  return (
    <section className="glass p-4 sm:p-6 min-h-[60vh]">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Ma progression</h2>
        <p className="text-sm opacity-70">
          Suivez votre avancement dans votre parcours d'apprentissage.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
          <TrendingUp className="w-5 h-5 mb-2 text-indigo-500" />
          <p className="text-2xl font-bold">{progress}%</p>
          <p className="text-sm opacity-60">Progression globale</p>
        </div>
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
          <CheckCircle2 className="w-5 h-5 mb-2 text-green-500" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm opacity-60">Cours terminés</p>
        </div>
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
          <Clock3 className="w-5 h-5 mb-2 text-blue-500" />
          <p className="text-2xl font-bold">0h</p>
          <p className="text-sm opacity-60">Temps d'apprentissage</p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progression</span>
          <span className="text-sm opacity-70">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-sm opacity-60">
          Votre progression apparaîtra ici au fur et à mesure de vos activités.
        </p>
      </div>
    </section>
  );
};

export default ProgressSection;
