"use client";

import { useState } from "react";
import emailjs from '@emailjs/browser';
import { ShieldCheck } from "lucide-react";

export default function ContactForm() {
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
  );
} 