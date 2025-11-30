// scripts/issueAndRead.js
// Script para emitir un certificado y luego leerlo desde la blockchain local

const { ethers } = require("ethers");

async function main() {
  // 1. Conectarnos al nodo local de Hardhat
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // 2. Usar la cuenta #0 de Hardhat como "institucion emisora"
  //    (la que viste cuando corriste `npx hardhat node`)
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Account #0
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Usando emisor:", await wallet.getAddress());

  // 3. Dirección del contrato desplegado (la que te dio Ignition)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // 4. ABI mínimo del contrato (solo las funciones que vamos a usar)
  const abi = [
    "function issueCertificate(string certId,string studentId,string degree,string issuedDate,string documentHash) external",
    "function getCertificate(string certId) view returns (string studentId,string degree,string issuedDate,string documentHash,address issuer,bool exists)",
  ];

  // 5. Instancia del contrato
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // 6. Datos de prueba del certificado
  const certId = "CERT-001";
  const studentId = "A01234567";
  const degree = "Ingenieria en Sistemas";
  const issuedDate = "2025-11-30";
  const documentHash =
    "b3f4c1a2d5e6f7c8b9a00112233445566778899aabbccddeeff001122334455"; // hash SHA-256 ficticio

  console.log("Emitiendo certificado...");

  // 7. Llamar a issueCertificate (transacción)
  const tx = await contract.issueCertificate(
    certId,
    studentId,
    degree,
    issuedDate,
    documentHash
  );
  console.log("Tx enviada:", tx.hash);

  // Esperar a que se mine
  await tx.wait();
  console.log("Certificado emitido ✅");

  // 8. Leer el certificado
  const cert = await contract.getCertificate(certId);

  console.log("\n===== Certificado leído desde la blockchain =====");
  console.log("ID:", certId);
  console.log("Alumno (ID):", cert.studentId);
  console.log("Programa:", cert.degree);
  console.log("Fecha:", cert.issuedDate);
  console.log("Hash:", cert.documentHash);
  console.log("Emisor:", cert.issuer);
  console.log("Existe:", cert.exists);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
