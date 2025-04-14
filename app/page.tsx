"use client"

import WrapperVitrine from "./component/layout/WrapperVitrine"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <WrapperVitrine>
      <section className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[#004d3b]">
            Simplifiez la gestion de votre association avec <span className="text-[#00B074]">Famease</span>
          </h1>
          <p className="mt-6 text-gray-700 text-lg">
            Gérez les familles, cotisations, attestations et exportations dans une interface claire et moderne. Famease est la solution tout-en-un pour les associations familiales, sportives ou culturelles.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/inscription" className="bg-[#00B074] hover:bg-[#009a66] text-white px-6 py-3 rounded-md text-sm font-semibold text-center">
              Créer une association
            </Link>
            <Link href="/fonctionnalites" className="border border-[#00B074] text-[#00B074] px-6 py-3 rounded-md text-sm font-semibold text-center hover:bg-[#f0fef8]">
              En savoir plus
            </Link>
          </div>
        </div>

        <div className="flex-1">
          <Image
            src="/hero-illustration.png"
            alt="Illustration gestion associative"
            width={600}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </section>

      <div className="w-full bg-[#f9f9f9] py-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex gap-8 items-center px-4 animate-scroll whitespace-nowrap [animation:scroll-left_20s_linear_infinite]">
          {["Asso 1", "Asso 2", "Fam Unite", "Partenaires+", "Union Club"].map((name, i) => (
            <div key={i} className="flex-shrink-0 w-32 h-16 bg-white shadow rounded-lg flex items-center justify-center">
              <span className="text-[#00B074] font-bold text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fonctionnalités */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-[#004d3b] mb-12">
          Ce que Famease fait pour vous
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Gestion des membres",
              desc: "Ajoutez, modifiez et visualisez les familles et leurs membres facilement.",
              icon: "/membres.png",
            },
            {
              title: "Cotisations simplifiées",
              desc: "Suivez les paiements, les factures et les relances en un clin d'œil.",
              icon: "/cotisation.png",
            },
            {
              title: "Exports & attestations",
              desc: "Générez en PDF ou Excel les données dont vous avez besoin.",
              icon: "/exportattestation.png",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <div className="flex justify-center mb-4">

                <Image src={feature.icon} alt={feature.title} width={120} height={120} className="mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-[#00B074] mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Avis utilisateurs */}
      <section className="w-full bg-[#f9f9f9] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#004d3b] mb-10">Ils utilisent Famease</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 mb-3">
                  "Nous avons complètement abandonné Excel. Famease est intuitif, rapide et adapté à notre association."
                </p>
                <span className="block text-sm font-semibold text-[#00B074]">Association Demo #{n}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </WrapperVitrine>
  )
}
