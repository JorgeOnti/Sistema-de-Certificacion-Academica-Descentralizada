// scripts/authorizeIssuer.cjs
const { ethers } = require("ethers");

async function main() {
  const newIssuer = process.argv[2]; // direccion a autorizar

  if (!newIssuer) {
    console.error("Uso: node scripts/authorizeIssuer.cjs <DIRECCION_ISSUER>");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Owner del contrato (cuenta #0 de Hardhat)
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const abi = [
    "function authorizeIssuer(address _issuer) external",
    "function authorizedIssuers(address) view returns (bool)",
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  console.log("Owner:", await wallet.getAddress());
  console.log("Autorizando emisor:", newIssuer);

  const tx = await contract.authorizeIssuer(newIssuer);
  console.log("Tx enviada:", tx.hash);
  await tx.wait();

  const isAuth = await contract.authorizedIssuers(newIssuer);
  console.log("¿Quedó autorizado?:", isAuth);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
