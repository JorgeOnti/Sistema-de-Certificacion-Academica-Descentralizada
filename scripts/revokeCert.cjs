// scripts/revokeCert.cjs
const { ethers } = require("ethers");

async function main() {
  const certId = process.argv[2];

  if (!certId) {
    console.error("Uso: node scripts/revokeCert.cjs <CERT_ID>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Usamos la misma cuenta #0 como emisor autorizado
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const abi = [
    "function revokeCertificate(string certId) external",
    "function getCertificate(string certId) view returns (string studentId,string degree,string issuedDate,string documentHash,address issuer,bool exists)",
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log("Revocando certificado:", certId);

  const tx = await contract.revokeCertificate(certId);
  console.log("Tx enviada:", tx.hash);
  await tx.wait();

  const cert = await contract.getCertificate(certId);
  console.log("Existe despues de revocar:", cert.exists);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
