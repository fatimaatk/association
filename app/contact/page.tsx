import PublicLayout from "../component/layout/PublicLayout";
import { LifeBuoy } from "lucide-react";
import ContactForm from "./ContactForm";
import { TUser } from "@/context/UserContext";
import { getUserFromCookies } from "@/lib/server-auth";

export default async function Contact() {
  const user = await getUserFromCookies();
  return (
    <PublicLayout utilisateur={user as TUser}>
      <section className="max-w-3xl mx-auto py-16 px-4 animate-fade-up">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#00B074] mb-2">
            Contactez l&apos;équipe FamEasy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question sur la gestion de votre association ? Un besoin d&apos;assistance ou une suggestion ? Notre équipe vous répond rapidement et avec le sourire !
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
          <ContactForm />
        </div>
      </section>
    </PublicLayout>
  );
}