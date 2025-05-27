import { Suspense } from 'react';
import ProtectedWrapper from "../component/layout/ProtectedWrapper";
import MembreList from '../component/membre/MembreList';

export const dynamic = 'force-dynamic';

export default function MembrePage() {
  return (
    <ProtectedWrapper>
      <Suspense fallback={<div>Chargement...</div>}>
        <MembreList />
      </Suspense>
    </ProtectedWrapper>
  );
} 