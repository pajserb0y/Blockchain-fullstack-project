const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  //http://172.20.240.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf8");

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy(); //STOP HERE! Wait for contrat to be deployed
  await contract.deployTransaction.wait(1);

  const currentFavouriteNumber = await contract.retrieve();
  console.log(`Current favourite number: ${currentFavouriteNumber.toString()}`);
  const txResponse = await contract.store("7");
  const txReciept = await txResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();
  console.log(`Updated favourite number: ${updatedFavouriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
