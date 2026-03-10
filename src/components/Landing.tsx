import React, { useState } from 'react';

type TestId = 'getalvaardigheid' | 'plaatsbepaling' | 'woordgeheugen' | 'redeneer' | 'foutdetectie';

const TEST_EXPLANATIONS: Record<TestId, { title: string, explanation: React.ReactNode }> = {
  getalvaardigheid: {
    title: 'Getalvaardigheidstest',
    explanation: (
      <div className="space-y-4">
        <p>Meet de snelheid en accuratesse van je hoofdrekenen.</p>
        <p><strong>Hoe werkt het:</strong> Je krijgt na elkaar twee sommen te zien (de Bovenste Lijn en de Onderste Lijn). Reken beide uit, onthoud de uitkomsten, en geef daarna aan of de <strong>B</strong>ovenste groter is, de <strong>O</strong>nderste groter is, of dat ze <strong>G</strong>elijk zijn.</p>
        <p><em>Geen hulpmiddelen toegestaan.</em></p>
      </div>
    )
  },
  plaatsbepaling: {
    title: 'Plaatsbepalingstest',
    explanation: (
      <div className="space-y-4">
        <p>Meet je ruimtelijk inzicht en patroonherkenning onder druk.</p>
        <p><strong>Hoe werkt het:</strong> Eerst krijg je twee regels te zien over pijlen (bijv. "Zwart ONDER Wit" en "Rechts Op BOVEN Links Neer").</p>
        <p>Vervolgens zie je een raster met 6 vakken. Elk vak bevat 2 pijlen (boven en onder). Je moet razendsnel het enige vak aanklikken dat aan <strong>beide regels tegelijk</strong> voldoet.</p>
      </div>
    )
  },
  woordgeheugen: {
    title: 'Woordgeheugentest',
    explanation: (
      <div className="space-y-4">
        <p>Meet je kortetermijngeheugen en categorisatie-snelheid.</p>
        <p><strong>Hoe werkt het:</strong> In het eerste scherm moet je drie categorieën onthouden, precies in die volgorde (bijv. Boom | Vis | Werktuig).</p>
        <p>In het tweede scherm zie je drie woorden. Je moet tellen hoeveel van deze woorden passen bij de categorie waaraan ze op die positie zijn gekoppeld. Klik op het juiste aantal (0 t/m 3).</p>
      </div>
    )
  },
  redeneer: {
    title: 'Redeneertest',
    explanation: (
      <div className="space-y-4">
        <p>Meet je logisch redeneervermogen aan de hand van stellingen.</p>
        <p><strong>Hoe werkt het:</strong> Lees de twee stellingen bovenaan die een rangorde bepalen (bijv. "A is groter dan B" en "A is kleiner dan C"). Kijk goed wat de specifieke vraag stelt (bijv. "Wie is de grootste?"), en klik het juiste antwoord aan uit de 3 keuzes onderin.</p>
      </div>
    )
  },
  foutdetectie: {
    title: 'Foutdetectietest',
    explanation: (
      <div className="space-y-4">
        <p>Meet je nauwkeurigheid en snelheid in het opsporen van kleine tekenverschillen.</p>
        <p><strong>Hoe werkt het:</strong> Je ziet onmiddellijk twee regels met onzintekst of codes. Vergelijk de onderste regel (kopie) met de bovenste regel (origineel) en tel het aantal tekens dat verschilt. Selecteer het aantal fouten (0 t/m 4).</p>
      </div>
    )
  }
};

interface LandingProps {
  onStartFullTest: () => void;
  onStartShortFullTest: () => void;
  onPracticeTest: (testId: string) => void;
  onViewScoreboard: () => void;
}

export const Landing: React.FC<LandingProps> = ({ 
  onStartFullTest, 
  onStartShortFullTest,
  onPracticeTest, 
  onViewScoreboard 
}) => {
  const [infoModal, setInfoModal] = useState<TestId | null>(null);

  const tests: { id: TestId, name: string }[] = [
    { id: 'getalvaardigheid', name: 'Getalvaardigheidstest' },
    { id: 'plaatsbepaling', name: 'Plaatsbepalingstest' },
    { id: 'woordgeheugen', name: 'Woordgeheugentest' },
    { id: 'redeneer', name: 'Redeneertest' },
    { id: 'foutdetectie', name: 'Foutdetectietest' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-military-500 tracking-tight uppercase shadow-sm">
          DOO Psychotechnische Tests
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Train snelheid en accuratesse onder realistische omstandigheden. 
          Geofocus op de 5 defensitypische psychotechnische proeven.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full">
        {/* Full Test Card */}
        <div className="bg-surface p-8 rounded-xl shadow-lg border border-military-800 flex flex-col items-center text-center gap-6 hover:border-military-600 transition-colors">
          <div className="w-16 h-16 bg-military-900 rounded-full flex items-center justify-center border-2 border-military-500">
            <svg className="w-8 h-8 text-military-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Simulatie DOO Test</h2>
            <p className="text-gray-400">Alle 5 tests achter elkaar. Geen hulpmiddelen. Maximale tijdsdruk.</p>
          </div>
          <div className="mt-auto w-full flex flex-col gap-3">
            <button 
              onClick={onStartFullTest}
              className="w-full py-4 bg-military-600 hover:bg-military-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base uppercase tracking-wide"
            >
              Start Volledige Test (125 vragen)
            </button>
            <button 
              onClick={onStartShortFullTest}
              className="w-full py-3 bg-surface hover:bg-military-800 border-2 border-military-700 text-military-400 hover:text-military-300 font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wide"
            >
              Start Korte Test (25 vragen)
            </button>
          </div>
        </div>

        {/* Practice Mode Card */}
        <div className="bg-surface p-8 rounded-xl shadow-lg border border-surface-light flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Oefen Modus</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            {tests.map(test => (
              <div key={test.id} className="flex gap-2">
                <button
                  onClick={() => onPracticeTest(test.id)}
                  className="flex-1 text-left px-4 py-3 bg-surface-light hover:bg-military-900 border border-transparent hover:border-military-700 rounded-md transition-colors text-gray-200 font-medium flex justify-between items-center group"
                >
                  {test.name}
                  <span className="text-military-500 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                </button>
                <button 
                  onClick={() => setInfoModal(test.id)}
                  className="w-12 bg-surface-light border border-transparent hover:border-military-500 hover:text-military-400 text-gray-400 rounded-md flex items-center justify-center transition-colors shadow"
                  title="Hoe werkt dit onderdeel?"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={onViewScoreboard}
        className="text-gray-400 hover:text-white underline underline-offset-4 decoration-military-600 hover:decoration-military-400 transition-colors"
      >
        Bekijk Scorebord
      </button>

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-surface border-2 border-military-600 rounded-xl max-w-lg w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setInfoModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold uppercase tracking-wide text-military-500 mb-6">
              {TEST_EXPLANATIONS[infoModal].title}
            </h3>
            <div className="text-gray-300 leading-relaxed text-lg pb-6">
              {TEST_EXPLANATIONS[infoModal].explanation}
            </div>
            <button 
              onClick={() => setInfoModal(null)}
              className="w-full py-3 bg-military-700 hover:bg-military-600 text-white font-bold rounded shadow transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
