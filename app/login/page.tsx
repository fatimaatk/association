"use client"


import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PublicLayout from "../component/layout/PublicLayout"
import { useUser } from "@/context/UserContext"

export default function LoginPage() {
  const user = useUser()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [erreur, setErreur] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user])

  const handleLogin = async (e) => {
    e.preventDefault()
    setErreur(null)
    setLoading(true)

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motDePasse }),
    })

    const data = await res.json()

    if (res.ok) {
      window.location.href = "/dashboard"
    } else {
      setErreur(data.message || "Erreur de connexion")
      setLoading(false)
    }
  }

  return (
    <PublicLayout >
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
          <h1 className="text-2xl font-bold text-center text-[#00B074] mb-6">
            Connexion
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="motDePasse"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                className="mt-1 block w-full border px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-[#00B074]"
              />
            </div>
            {erreur && <p className="text-red-600 text-sm text-center">{erreur}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00B074] hover:bg-[#009a66] text-white font-semibold py-2 rounded-md transition"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Pas encore de compte ? {" "}
            <Link href="/inscription" className="text-[#00B074] hover:underline">
              Créer une association
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
