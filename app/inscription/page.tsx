"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WrapperVitrine from "../component/layout/PublicLayout";
import { useUser } from "@/context/UserContext";

export default function InscriptionPage() {
  const user = useUser()
  const router = useRouter();


  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user])


  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    siret: "",
    telephone: "",
    type: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/association", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          siret: formData.siret,
          telephone: formData.telephone,
          type: formData.type,
          compte: {
            email: formData.email,
            motDePasse: formData.password,
            nom: "Admin",
            prenom: "Admin",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de la création");
        return;
      }

      // Si l'API renvoie un token à stocker (à activer si tu veux le gérer ici)
      document.cookie = `token=${data.token}; path=/;`;

      alert("Association créée avec succès !");
      router.push("/dashboard"); // change la route cible si nécessaire
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperVitrine>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-8">
          <h1 className="text-2xl font-bold text-center text-[#00B074] mb-6">
            Créer votre association
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Nom de l'association", name: "nom", type: "text" },
              { label: "Email de contact", name: "email", type: "email" },
              { label: "Numéro SIRET", name: "siret", type: "text" },
              { label: "Téléphone", name: "telephone", type: "text" },
              { label: "Type d'association", name: "type", type: "text" },
              { label: "Mot de passe administrateur", name: "password", type: "password" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-[#00B074] text-white font-semibold py-2 rounded-md hover:bg-[#009a66] transition"
              disabled={loading}
            >
              {loading ? "Création en cours..." : "Créer mon association"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-[#00B074] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </WrapperVitrine>
  );
}
