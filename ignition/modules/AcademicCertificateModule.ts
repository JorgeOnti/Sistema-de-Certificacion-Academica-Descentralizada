// ignition/modules/AcademicCertificateModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AcademicCertificateModule", (m) => {
  // Despliega el contrato AcademicCertificate sin parámetros de constructor
  const academicCertificate = m.contract("AcademicCertificate");

  // Lo regresamos para poder usarlo después si lo necesitamos
  return { academicCertificate };
});
