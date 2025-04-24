
import ExportPDFClient from "../component/export/ExportPDFClient";
import ProtectedWrapper from "../component/layout/ProtectedWrapper";

export default function ExportPage() {
  return (
    <ProtectedWrapper>
      <ExportPDFClient />
    </ProtectedWrapper>
  );
}
