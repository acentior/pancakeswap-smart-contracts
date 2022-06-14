import { ethers, network, run } from "hardhat";
import { constants } from "@openzeppelin/test-helpers";
import config from "../config";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const { name } = network;

  // if (name == "mainnet") {
  //   if (!process.env.KEY_MAINNET) {
  //     throw new Error("Missing private key, refer to README 'Deployment' section");
  //   }
  //   if (!config.Admin[name] || config.Admin[name] === constants.ZERO_ADDRESS) {
  //     throw new Error("Missing admin address, refer to README 'Deployment' section");
  //   }
  //   if (!config.Treasury[name] || config.Treasury[name] === constants.ZERO_ADDRESS) {
  //     throw new Error("Missing treasury address, refer to README 'Deployment' section");
  //   }
  //   if (!config.Syrup[name] || config.Syrup[name] === constants.ZERO_ADDRESS) {
  //     throw new Error("Missing syrup address, refer to README 'Deployment' section");
  //   }
  //   if (!config.Cake[name] || config.Cake[name] === constants.ZERO_ADDRESS) {
  //     throw new Error("Missing syrup address, refer to README 'Deployment' section");
  //   }
  //   if (!config.MasterChef[name] || config.MasterChef[name] === constants.ZERO_ADDRESS) {
  //     throw new Error("Missing master address, refer to README 'Deployment' section");
  //   }
  // }

  console.log("Deploying to network:", network);

  let admin; let treasury;

  // if (name == "mainnet") {
  //   admin = config.Admin[name];
  //   treasury = config.Treasury[name];
  //   cake = config.Cake[name];
  //   syrup = config.Syrup[name];
  //   masterchef = config.MasterChef[name];
  // } else {
  // }
  console.log("Deploying mocks");
  const CakeContract = await ethers.getContractFactory("CakeToken");
  const SyrupContract = await ethers.getContractFactory("SyrupBar");
  const MasterChefContract = await ethers.getContractFactory("MasterChef");
  const currentBlock = await ethers.provider.getBlockNumber();

  if (name === "hardhat") {
    const [deployer] = await ethers.getSigners();
    admin = deployer.address;
    treasury = deployer.address;
  } else {
    admin = config.Admin[name];
    treasury = config.Treasury[name];
  }

  const cake = (await CakeContract.deploy());
  await cake.deployed();
  const syrup = (await SyrupContract.deploy(cake.address));
  await syrup.deployed();
  const masterchef = (await MasterChefContract.deploy(cake.address, syrup.address, admin, ethers.BigNumber.from("1"), currentBlock));

  await masterchef.deployed();

  console.log("Admin:", admin);
  console.log("Treasury:", treasury);
  console.log("Cake deployed to:", cake.address);
  console.log("Syrup deployed to:", syrup.address);
  console.log("MasterChef deployed to:", masterchef.address);

  console.log("Deploying Cake Vault...");

  const CakeVaultContract = await ethers.getContractFactory("CakeVault");
  const cakeVault = await CakeVaultContract.deploy(cake.address, syrup.address, masterchef.address, admin, treasury);
  await cakeVault.deployed();

  console.log("CakeVault deployed to:", cakeVault.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
