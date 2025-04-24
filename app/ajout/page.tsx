'use server';

import Wrapper from '../component/layout/ProtectedWrapper';
import { getTypesFamilles } from '@/lib/type';
import FormAjoutFamille from '../component/ajout/FormAjoutFamille';
import ProtectedWrapper from '../component/layout/ProtectedWrapper';

export default async function NouvelleFamillePage() {
  try {
    const types = await getTypesFamilles();
    return (
      <ProtectedWrapper>
        <FormAjoutFamille types={types} />
      </ProtectedWrapper>
    );
  } catch (error) {
    console.error('Erreur lors du chargement des types de familles :', error);
    return (
      <Wrapper>
        <div className="max-w-xl mx-auto p-4 text-center text-red-600">
          Une erreur est survenue lors du chargement du formulaire. Veuillez réessayer plus tard.
        </div>
      </Wrapper>
    );
  }
}