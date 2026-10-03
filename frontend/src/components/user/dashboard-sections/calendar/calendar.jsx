import React from 'react';

const CalendarSection = () => {
  const today = new Date();
  const month = today.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="glass p-4 sm:p-6 min-h-[60vh]">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Calendrier</h2>
        <p className="text-sm opacity-70 capitalize">{month}</p>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6 text-center">
        <p className="text-base font-medium mb-2">Aucun événement prévu</p>
        <p className="text-sm opacity-60">
          Votre calendrier apparaîtra ici lorsque des événements seront disponibles.
        </p>
      </div>
    </section>
  );
};

export default CalendarSection;
