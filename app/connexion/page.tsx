"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PublicLayout from "../component/layout/PublicLayout"
import { useUser } from "@/context/UserContext"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function ConnexionPage() {
  const user = useUser()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState("")

  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErreur("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErreur(data.message || "Identifiants incorrects.")
        setLoading(false)
        return
      }
      router.push("/dashboard")
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setErreur("Erreur de connexion. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-2 sm:px-4 animate-fade-up">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 sm:p-8 mx-auto">
          <h1 className="text-2xl font-bold text-center text-[#00B074] mb-2">Connexion à FamEasy</h1>
          <p className="text-center text-gray-600 mb-6">Accédez à votre espace association</p>
          <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:border-[#00B074] focus:outline-none"
                  placeholder="votre@email.fr"
                />
              </div>
            </div>
            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  id="motDePasse"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:border-[#00B074] focus:outline-none"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-[#00B074]"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                {erreur}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00B074] text-white py-2 rounded-md font-semibold hover:bg-[#009a66] transition disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <div className="flex justify-between items-center mt-4 text-sm">
            <a href="/mot-de-passe-oublie" className="text-[#00B074] hover:underline">
              Mot de passe oublié ?
            </a>
            <a href="/inscription" className="text-gray-600 hover:underline">
              Créer une association
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
