// scripts/getCert.cjs
const { ethers } = require("ethers");

async function main() {
  // Obtener el certId desde la línea de comandos
  const certId = process.argv[2];

  if (!certId) {
    console.error("Uso: node scripts/getCert.cjs <CERT_ID>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // No necesitamos wallet para solo leer, pero por simplicidad usamos la misma
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const abi = [
    "function getCertificate(string certId) view returns (string studentId,string degree,string issuedDate,string documentHash,address issuer,bool exists)",
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log(`Buscando certificado con ID: ${certId} ...`);

  const cert = await contract.getCertificate(certId);

  console.log("\n===== Resultado =====");
  console.log("Alumno (ID):", cert.studentId);
  console.log("Programa:", cert.degree);
  console.log("Fecha:", cert.issuedDate);
  console.log("Hash:", cert.documentHash);
  console.log("Emisor:", cert.issuer);
  console.log("Existe:", cert.exists);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
