import { Suspense } from 'react';
import ResultatsRecherche from '../component/recherche/ResultatRecherche';
import Wrapper from '../component/layout/ProtectedWrapper';

export default function Page() {
  return (
    <Wrapper>
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Chargement des résultats...</div>}>
        <ResultatsRecherche />
      </Suspense>
    </Wrapper>
  );
}