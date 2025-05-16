import { Users, HeartHandshake, ShieldCheck, Lightbulb } from "lucide-react";
import PublicLayout from "../component/layout/PublicLayout";
export default function APropos() {
  return (
    <PublicLayout>

      <section className="max-w-3xl mx-auto py-16 px-4 animate-fade-up">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#00B074] mb-2">À propos de Famease</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Famease est la solution SaaS pensée pour simplifier la gestion des associations familiales, sportives et culturelles. Notre mission : vous faire gagner du temps, sécuriser vos données et offrir une expérience moderne à tous vos membres.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="bg-[#e6f9f2] p-3 rounded-full">
              <Users className="text-[#00B074] w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Pour toutes les associations</h2>
              <p className="text-gray-600">
                Que vous soyez une association familiale, sportive, culturelle ou sociale, Famease s’adapte à vos besoins et à votre organisation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-[#e6f9f2] p-3 rounded-full">
              <HeartHandshake className="text-[#00B074] w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Simplicité & Accessibilité</h2>
              <p className="text-gray-600">
                Une interface claire, intuitive et accessible à tous, sur ordinateur, tablette ou mobile.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-[#e6f9f2] p-3 rounded-full">
              <ShieldCheck className="text-[#00B074] w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Sécurité & Confidentialité</h2>
              <p className="text-gray-600">
                Vos données sont protégées et hébergées en France. Famease respecte la vie privée de vos membres.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-[#e6f9f2] p-3 rounded-full">
              <Lightbulb className="text-[#00B074] w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Innovation continue</h2>
              <p className="text-gray-600">
                Nous faisons évoluer Famease en permanence grâce à vos retours et aux besoins du secteur associatif.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f0fef8] rounded-xl p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold text-[#00B074] mb-2">Notre engagement</h3>
          <p className="text-gray-700 mb-4">
            Vous accompagner au quotidien, vous faire gagner du temps et vous permettre de vous concentrer sur l’essentiel : la vie de votre association.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#00B074] text-white px-6 py-2 rounded-md font-medium shadow hover:bg-[#009a66] transition"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}