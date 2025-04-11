'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Wrapper from '@/app/component/Wrapper';
import Loader from '@/app/component/loader';
import { IFamille } from '@/models/interfaceFamilles';
import { Search } from 'lucide-react';

export default function ResultatsRecherche() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [resultats, setResultats] = useState<IFamille[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultats = async () => {
      if (!query) return;
      try {
        const res = await fetch(`/api/recherche?q=${query}`);
        const data = await res.json();
        setResultats(data);
      } catch (err) {
        console.error('Erreur de recherche :', err);
        setResultats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResultats();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-[#00B074] mb-6 flex items-center gap-2">
        <Search className="w-5 h-5" />
        Résultats pour : &ldquo;{query}&ldquo;
      </h1>

      {loading ? (
        <Loader loading={loading} />
      ) : resultats && resultats.length > 0 ? (
        <div className="space-y-4">
          {resultats.map((famille) => (
            <Link
              href={`/famille/${famille.id}`}
              key={famille.id}
              className="block p-4 rounded-xl border bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <h2 className="text-lg font-semibold  text-[#00B074]">
                {famille.chefFamille?.nom?.toUpperCase()} {famille.chefFamille?.prenom}
              </h2>
              <p className="text-sm text-gray-600">Adresse : {famille.adresse}</p>
              <p className="text-sm text-gray-600">Email : {famille.adresseEmail}</p>
              <p className="text-sm text-gray-600">Téléphone : {famille.telephone}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucun résultat trouvé pour cette recherche.</p>
      )}
    </div>
  );
}
