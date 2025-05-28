"use client";
import PublicLayout from "../component/layout/PublicLayout";
import { ShieldCheck, LifeBuoy } from "lucide-react";
import { useState } from "react";
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nom: formData.get('nom'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: data.nom,
          from_email: data.email,
          message: data.message,
          to_name: "FamEasy Support",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSent(true);
    } catch (err) {
      console.log(err);
      setError('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="max-w-3xl mx-auto py-16 px-4 animate-fade-up">
        <div className="mb-10 text-center">

          <h1 className="text-4xl font-extrabold text-[#00B074] mb-2">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Contactez l'équipe FamEasy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Une question sur la gestion de votre association ? Un besoin d'assistance ou une suggestion ? Notre équipe vous répond rapidement et avec le sourire !
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          {/* Coordonnées & réseaux */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#f0fef8] rounded-lg p-4 mt-4 flex items-center gap-3">
              <LifeBuoy className="text-[#00B074] w-6 h-6" />
              <div>
                <div className="font-semibold text-gray-800">Déjà client ?</div>
                <div className="text-sm text-gray-600">
                  Pour une assistance technique rapide, écrivez à <a href="mailto:fameasy.contact@gmail.com" className="text-[#00B074] underline">fameasy.contact@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div>
            {sent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-5 rounded text-center shadow">
                <div className="text-xl font-bold mb-2">Merci pour votre message !</div>
                <div>Notre équipe vous répondra sous 24h ouvrées.</div>
              </div>
            ) : (
              <form
                className="space-y-4 bg-white p-6 rounded-xl shadow"
                onSubmit={handleSubmit}
                aria-label="Formulaire de contact"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                <input
                  name="nom"
                  type="text"
                  placeholder="Votre nom"
                  required
                  autoComplete="name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-[#00B074] focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Votre email"
                  required
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-[#00B074] focus:outline-none"
                />
                <textarea
                  name="message"
                  placeholder="Votre message"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-[#00B074] focus:outline-none"
                  rows={5}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#00B074] text-white px-6 py-2 rounded-md hover:bg-[#009a66] transition w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer'}
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