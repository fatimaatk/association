import { TUser } from "@/context/UserContext";
import PublicLayout from "../component/layout/PublicLayout";
import { getUserFromCookies } from "@/lib/server-auth";

export default async function MentionsLegales() {
  const user = await getUserFromCookies();
  return (
    <PublicLayout utilisateur={user as TUser}>
      <section className="max-w-3xl mx-auto py-16 px-4 animate-fade-up">
        <h1 className="text-3xl font-extrabold text-[#00B074] mb-6 text-center">Mentions légales</h1>

        <div className="space-y-8 text-gray-700 text-base">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Éditeur du site</h2>
            <p>
              <span className="font-semibold">FamEasy</span><br />
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Solution SaaS de gestion d'associations familiales, sportives et culturelles.<br />
              Email : <a href="mailto:fameasy.contact@gmail.com" className="text-[#00B074] hover:underline">fameasy.contact@gmail.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Hébergement</h2>
            <p>
              <span className="font-semibold">Vercel Inc.</span><br />
              440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
              <a href="https://vercel.com" target="_blank" rel="noopener" className="text-[#00B074] hover:underline">https://vercel.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Responsable de la publication</h2>
            <p>
              FamEasy – fameasy.contact@gmail.com
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Propriété intellectuelle</h2>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              L'ensemble du contenu du site FamEasy (textes, images, logos, icônes, logiciels, etc.) est protégé par le droit d'auteur. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de FamEasy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Données personnelles</h2>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              FamEasy s'engage à respecter la confidentialité des données personnelles collectées et à les traiter dans le respect du RGPD. Pour en savoir plus, consultez notre <a href="/politique-confidentialite" className="text-[#00B074] hover:underline">politique de confidentialité</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact</h2>
            <p>
              Pour toute question concernant les mentions légales du site FamEasy, vous pouvez nous écrire à <a href="mailto:fameasy.contact@gmail.com" className="text-[#00B074] hover:underline">fameasy.contact@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}