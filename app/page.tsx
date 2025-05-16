import Link from "next/link";
import Image from "next/image";
import PublicLayout from "./component/layout/PublicLayout";
import { getUserFromCookies } from "@/lib/auth";
import ProcessSwiper from "./component/home/ProcessSwiper";
import { FadeUp } from "./component/home/FadeUp";
import { TUser } from "@/context/UserContext";
export default async function HomePage() {
  const user = await getUserFromCookies();
  return (
    <PublicLayout utilisateur={user as TUser}>
      <FadeUp>
        <section className="w-full max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <p className="uppercase text-sm tracking-widest text-[#00B074] mb-2">
              La solution tout-en-un pour les associations
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[#004d3b]">
              Simplifiez la gestion de votre association avec <span className="text-[#00B074]">Famease</span>
            </h1>
            <ul className="mt-6 text-gray-700 text-lg space-y-2">
              <li>Gérez familles & cotisations sans effort</li>
              <li>Téléchargez attestations & factures en un clic</li>
              <li>Gagnez du temps avec une interface simple et moderne</li>
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/inscription" className="bg-[#00B074] hover:bg-[#009a66] text-white px-8 py-4 rounded-md text-base font-semibold shadow-md transition">
                Créer une association
              </Link>
              <Link href="/a-propos" className="border-2 border-[#00B074] text-[#00B074] px-8 py-4 rounded-md text-base font-semibold shadow-md transition hover:bg-[#f0fef8]">
                En savoir plus
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <Image src="/hero-illustration.png" alt="Illustration gestion associative" width={600} height={500} className="w-full h-auto" />
          </div>
        </section>
      </FadeUp>

      <FadeUp>
        <ProcessSwiper />
      </FadeUp>

      <FadeUp>
        <section className="w-full bg-[#f9f9f9] py-20 sm:py-24 lg:py-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#004d3b] mb-4">Ils nous font confiance</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-10">
              Découvrez comment Famease aide les associations à gagner du temps et à se concentrer sur l’essentiel : leurs adhérents.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Sophie Martin",
                  role: "Présidente - Union Club",
                  review: "Nous avons complètement abandonné Excel. Famease est intuitif, rapide et parfaitement adapté à nos besoins.",
                },
                {
                  name: "Karim Benali",
                  role: "Trésorier - Asso Sportive",
                  review: "Un vrai gain de temps pour gérer les cotisations et les attestations. La prise en main est super simple.",
                },
                {
                  name: "Laura Dupuis",
                  role: "Secrétaire - Culture Ensemble",
                  review: "Un outil moderne qui nous facilite la vie. On peut enfin suivre les paiements et générer les documents facilement.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#00B074] text-white flex items-center justify-center rounded-full text-xl font-bold mb-4">
                    {testimonial.name[0]}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">&quot;{testimonial.review}&quot;</p>
                  <span className="block text-sm font-semibold text-[#004d3b]">{testimonial.name}</span>
                  <span className="block text-xs text-gray-500">{testimonial.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>
    </PublicLayout>
  );
}
