'use client';

import React from 'react';
import Paper from '@mui/material/Paper';
import Header from '@/components/header';
import Footer from '@/components/footer';

const Impressum: React.FC = () => {
  return (
    <>
      <Header />
      <Paper className="w-11/12 mx-auto bg-transparent p-5">
        <div className="text-left space-y-4">
          <h4 className="text-2xl font-bold">Impressum</h4>

          <h5 className="text-xl font-semibold">Diensteanbieter</h5>
          <p className="text-lg">
            <strong>{/* Dein Name */} Max Mustermann</strong>
            <br />
            {/* Deine Straße */} Musterstraße 1<br />
            {/* Deine Postleitzahl und Stadt */} 12345 Musterstadt
            <br />
            {/* Dein Land */} Deutschland
          </p>

          <h5 className="text-xl font-semibold">
            Inhaltlich Verantwortlicher i.S.d. §18 Abs. 2 MStV
          </h5>
          <p className="text-lg">
            <strong>{/* Dein Name */} Max Mustermann</strong>
          </p>

          <h5 className="text-xl font-semibold">Online-Streitbeilegung (OS)</h5>
          <p className="text-lg">
            Online-Streitbeilegung: Die Europäische Kommission stellt eine
            Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            finden. Verbraucher haben die Möglichkeit, diese Plattform für die
            Beilegung ihrer Streitigkeiten zu nutzen.
          </p>
        </div>
      </Paper>
      <Footer />
    </>
  );
};

export default Impressum;
