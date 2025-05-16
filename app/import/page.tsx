
import ImportFamillesClient from "../component/import/ImportfamillesClient";
import ProtectedWrapper from "../component/layout/ProtectedWrapper";

export default function ImportPage() {
  return (
    <ProtectedWrapper>
      <ImportFamillesClient />
    </ProtectedWrapper>
  );
}