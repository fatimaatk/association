import PublicLayout from '../component/layout/PublicLayout';
import { getUserFromCookies } from '@/lib/auth';
import { TUser } from '@/context/UserContext';
import TarifContent from '../component/tarif/TarifContent';

export default async function TarifPage() {
  const user = await getUserFromCookies();
  return (
    <PublicLayout utilisateur={user as TUser}>
      <TarifContent />
    </PublicLayout>
  );
} 