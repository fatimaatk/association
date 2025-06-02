import { Users, HeartHandshake, ShieldCheck, Lightbulb } from "lucide-react";
import PublicLayout from "../component/layout/PublicLayout";
import { TUser } from "@/context/UserContext";
import { getUserFromCookies } from "@/lib/server-auth";

export default async function APropos() {
  const user = await getUserFromCookies();

  return (
    <PublicLayout utilisateur={user as TUser}>
      <section className="max-w-3xl mx-auto py-8 md:py-16 px-4 animate-fade-up">
        <div className="mb-8 md:mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#00B074] mb-3 md:mb-2">À propos de FamEasy</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2 md:px-0">
            FamEasy est la solution SaaS pensée pour simplifier la gestion des associations familiales, sportives et culturelles. Notre mission : vous faire gagner du temps, sécuriser vos données et offrir une expérience moderne à tous vos membres.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="flex items-start gap-3 md:gap-4 bg-white p-4 md:p-0 rounded-lg md:rounded-none shadow-sm md:shadow-none">
            <div className="bg-[#e6f9f2] p-2 md:p-3 rounded-full shrink-0">
              <Users className="text-[#00B074] w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">Pour toutes les associations</h2>
              <p className="text-sm md:text-base text-gray-600">
                Que vous soyez une association familiale, sportive, culturelle ou sociale, FamEasy s&apos;adapte à vos besoins et à votre organisation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:gap-4 bg-white p-4 md:p-0 rounded-lg md:rounded-none shadow-sm md:shadow-none">
            <div className="bg-[#e6f9f2] p-2 md:p-3 rounded-full shrink-0">
              <HeartHandshake className="text-[#00B074] w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">Simplicité & Accessibilité</h2>
              <p className="text-sm md:text-base text-gray-600">
                Une interface claire, intuitive et accessible à tous, sur ordinateur, tablette ou mobile.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:gap-4 bg-white p-4 md:p-0 rounded-lg md:rounded-none shadow-sm md:shadow-none">
            <div className="bg-[#e6f9f2] p-2 md:p-3 rounded-full shrink-0">
              <ShieldCheck className="text-[#00B074] w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">Sécurité & Confidentialité</h2>
              <p className="text-sm md:text-base text-gray-600">
                Vos données sont protégées et hébergées en France. FamEasy respecte la vie privée de vos membres.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:gap-4 bg-white p-4 md:p-0 rounded-lg md:rounded-none shadow-sm md:shadow-none">
            <div className="bg-[#e6f9f2] p-2 md:p-3 rounded-full shrink-0">
              <Lightbulb className="text-[#00B074] w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">Innovation continue</h2>
              <p className="text-sm md:text-base text-gray-600">
                Nous faisons évoluer FamEasy en permanence grâce à vos retours et aux besoins du secteur associatif.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#f0fef8] rounded-xl p-6 md:p-8 text-center shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-[#00B074] mb-3 md:mb-2">Notre engagement</h3>
          <p className="text-sm md:text-base text-gray-700 mb-6 md:mb-4">
            Vous accompagner au quotidien, vous faire gagner du temps et vous permettre de vous concentrer sur l&apos;essentiel : la vie de votre association.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#00B074] text-white px-6 py-2.5 rounded-md font-medium shadow hover:bg-[#009a66] transition text-sm md:text-base"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}