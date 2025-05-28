"use client";

import Link from "next/link";
import PublicLayout from "../component/layout/PublicLayout";

export default function PolitiqueConfidentialite() {
  return (
    <PublicLayout>
      <section className="max-w-3xl mx-auto px-4 py-16 animate-fade-up">
        <h1 className="text-3xl font-extrabold text-[#00B074] mb-6 text-center">
          Politique de confidentialité
        </h1>

        <p className="mb-8 text-gray-700 text-base text-center">
          FamEasy s’engage à protéger la vie privée de ses utilisateurs et la confidentialité de leurs données personnelles, conformément au RGPD.
        </p>

        <div className="space-y-8 text-gray-700 text-base">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Collecte des données</h2>
            <p>
              Nous collectons uniquement les données strictement nécessaires à la gestion de votre compte, de votre association et de ses membres : nom, prénom, email, informations d’association, et données de connexion.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Utilisation des données</h2>
            <ul className="list-disc list-inside mt-2 mb-2">
              <li>Gestion de votre espace utilisateur et de votre association</li>
              <li>Suivi des membres, cotisations, factures et attestations</li>
              <li>Envoi d’informations importantes liées à votre activité associative</li>
            </ul>
            <p>Vos données ne sont jamais revendues à des tiers.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Sécurité et hébergement</h2>
            <p>
              FamEasy met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir la sécurité de vos données (chiffrement, accès restreint, sauvegardes). Les données sont hébergées en France ou en Union Européenne.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Droits des utilisateurs</h2>
            <p>
              Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, de suppression et de portabilité de vos données. Pour exercer vos droits, contactez-nous à :{" "}
              <a href="mailto:fameasy.contact@gmail.com" className="text-[#00B074] hover:underline">fameasy.contact@gmail.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Cookies</h2>
            <p>
              FamEasy utilise uniquement des cookies techniques nécessaires au bon fonctionnement du service (authentification, sécurité). Aucun cookie publicitaire ou de suivi tiers n’est utilisé.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Modification de la politique</h2>
            <p>
              FamEasy se réserve le droit de modifier la présente politique de confidentialité. Toute modification sera publiée sur cette page.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-[#00B074] hover:underline font-medium">
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}