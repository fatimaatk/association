
import ImportClientPage from '../component/familles/ImportClientPage';
import ProtectedWrapper from '../component/layout/ProtectedWrapper';

export default function ImportPage() {
  return (
    <ProtectedWrapper>
      <ImportClientPage />
    </ProtectedWrapper>
  );
}
