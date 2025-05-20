"use client";
import PublicLayout from "../component/layout/PublicLayout";
import { ShieldCheck, LifeBuoy } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <PublicLayout>
      <section className="max-w-3xl mx-auto py-16 px-4 animate-fade-up">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#00B074] mb-2">Contactez l’équipe Fameasy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question sur la gestion de votre association ? Un besoin d’assistance ou une suggestion ? Notre équipe vous répond rapidement et avec le sourire !
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          {/* Coordonnées & réseaux */}
          <div className="flex flex-col gap-6">


            <div className="bg-[#f0fef8] rounded-lg p-4 mt-4 flex items-center gap-3">
              <LifeBuoy className="text-[#00B074] w-6 h-6" />
              <div>
                <div className="font-semibold text-gray-800">Déjà client ?</div>
                <div className="text-sm text-gray-600">
                  Pour une assistance technique rapide, écrivez à <a href="mailto:support@fameasy.fr" className="text-[#00B074] underline">support@fameasy.fr</a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div>
            {sent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-5 rounded text-center shadow">
                <div className="text-xl font-bold mb-2">Merci pour votre message !</div>
                <div>Notre équipe vous répondra sous 24h ouvrées.</div>
              </div>
            ) : (
              <form
                className="space-y-4 bg-white p-6 rounded-xl shadow"
                onSubmit={e => {
                  e.preventDefault();
                  setSent(true);
                }}
                aria-label="Formulaire de contact"
              >
                <input
                  type="text"
                  placeholder="Votre nom"
                  required
                  autoComplete="name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-[#00B074] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  required
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-[#00B074] focus:outline-none"
                />
                <textarea
                  placeholder="Votre message"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-[#00B074] focus:outline-none"
                  rows={5}
                />
                <button
                  type="submit"
                  className="bg-[#00B074] text-white px-6 py-2 rounded-md hover:bg-[#009a66] transition w-full font-semibold"
                >
                  Envoyer
                </button>
              </form>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#00B074]" />
              Vos données sont confidentielles et ne seront jamais partagées.
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}