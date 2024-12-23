'use client';

import React from 'react';
import Paper from '@mui/material/Paper';
import Header from '@/components/header';
import Footer from '@/components/footer';

const Datenschutz: React.FC = () => {
  return (
    <>
      <Header />
      <Paper className="w-11/12 mx-auto bg-transparent p-5">
        <div className="text-left space-y-4">
          <h4 className="text-2xl font-bold">Datenschutzerklärung</h4>

          <p className="text-lg">
            Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Da
            unsere Website keine Nutzerlogins, Tracking-Techniken oder Cookies
            verwendet, ist die Nutzung unserer Seite ohne die Erhebung
            personenbezogener Daten möglich.
          </p>

          <h5 className="text-xl font-semibold">
            Erhebung und Verarbeitung von Daten
          </h5>
          <p className="text-lg">
            Es werden keine persönlichen Daten von dir erhoben, wenn du unsere
            Website besuchst. Wir speichern keine Informationen über deinen
            Besuch, wie etwa IP-Adressen, Browserdaten oder ähnliche
            Informationen.
          </p>

          <h5 className="text-xl font-semibold">Cookies</h5>
          <p className="text-lg">
            Unsere Website verwendet keine Cookies. Es werden keine
            Tracking-Cookies gesetzt, und es werden keine Daten für
            Analysezwecke gesammelt.
          </p>

          <h5 className="text-xl font-semibold">Kontakt</h5>
          <p className="text-lg">
            Solltest du Fragen zu dieser Datenschutzerklärung haben, kannst du
            uns gerne per E-Mail kontaktieren:{' '}
            <a
              href="mailto:info@deinewebsite.de"
              className="text-blue-600 underline"
            >
              info@deinewebsite.de
            </a>
            .
          </p>
        </div>
      </Paper>
      <Footer />
    </>
  );
};

export default Datenschutz;
