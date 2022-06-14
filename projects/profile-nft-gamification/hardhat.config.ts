import type { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-watcher";
import "solidity-coverage";
import "dotenv/config";

const bscTestnet: NetworkUserConfig = {
  url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  chainId: 97,
  accounts: [process.env.KEY_TESTNET!],
};

const bscMainnet: NetworkUserConfig = {
  url: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  accounts: [process.env.KEY_MAINNET!],
};

const exlTestnet: NetworkUserConfig = {
  url: "https://testnet-rpc.exlscan.com/",
  chainId: 27082017,
  accounts: [process.env.KEY_MAINNET!],
  timeout: 9999999,
  from: '0x19c03964f154e70B59A05748f28CBcb3ccF6C4D4',
}

const exlMainnet: NetworkUserConfig = {
  url: "https://rpc.exlscan.com/",
  chainId: 27082022,
  accounts: [process.env.KEY_TESTNET!],
  timeout: 9999999,
  from: '0x19c03964f154e70B59A05748f28CBcb3ccF6C4D4',
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    testnet: exlTestnet,
    mainnet: exlMainnet,
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: false,
  },
  watcher: {
    compile: {
      tasks: ["compile"],
    },
    test: {
      tasks: ["test"],
    },
  },
};

export default config;
