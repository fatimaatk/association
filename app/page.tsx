import Link from "next/link";
import Image from "next/image";
import PublicLayout from "./component/layout/PublicLayout";
import { getUserFromCookies } from "@/lib/server-auth";
import ProcessSwiper from "./component/home/ProcessSwiper";
import { FadeUp } from "./component/home/FadeUp";
import { TUser } from "@/context/UserContext";
import HomeBanner from './component/home/HomeBanner';

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
              Simplifiez la gestion de votre association avec <span className="text-[#00B074]">FamEasy</span>
            </h1>
            <ul className="mt-6 text-gray-700 text-lg space-y-2">
              <li>Gérez familles & cotisations sans effort</li>
              <li>Téléchargez attestations & factures en un clic</li>
              <li>Gagnez du temps avec une interface simple et moderne</li>
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!user ? (
                <>
                  <Link href="/inscription" className="bg-[#00B074] hover:bg-[#009a66] text-white px-8 py-4 rounded-md text-base font-semibold shadow-md transition">
                    Devenir testeur
                  </Link>
                  <Link href="/a-propos" className="border-2 border-[#00B074] text-[#00B074] px-8 py-4 rounded-md text-base font-semibold shadow-md transition hover:bg-[#f0fef8]">
                    En savoir plus
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="bg-[#00B074] hover:bg-[#009a66] text-white px-8 py-4 rounded-md text-base font-semibold shadow-md transition">
                    Accéder à mon espace
                  </Link>
                  <Link href="/contact" className="border-2 border-[#00B074] text-[#00B074] px-8 py-4 rounded-md text-base font-semibold shadow-md transition hover:bg-[#f0fef8]">
                    Nous contacter
                  </Link>
                </>
              )}
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
        <HomeBanner variant="secondary" className="mb-12" user={user as TUser} />
      </FadeUp>
    </PublicLayout>
  );
}
