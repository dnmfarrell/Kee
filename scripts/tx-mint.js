const { ethers } = require('ethers');
// This script calls Kee.mint() to create a transaction and prints the
// transaction data.
//
// Instructions:
// 1. start the local eth network with "npx hardhat node"
// 2. deploy the contract with "npx hardhat test --network localhost"
// 3. now you can run this script with "node scripts/tx-mint.js"

const NUM_ADDRESSES = 10;

const provider = new ethers.JsonRpcProvider(); // 0:8545

(async () => {
  const signer = await provider.getSigner(0);
  const abi = ["function mint(bytes32,bytes)"];
  const contract = new ethers.Contract("0x5fbdb2315678afecb367f032d93f642f64180aa3", abi, signer);
  let types = [];
  let addrs = [];
  for (let i = 0; i < NUM_ADDRESSES; i++) {
    types.push("address");
    addrs.push(ethers.Wallet.createRandom().address);
  }
  const tx = await contract.mint(ethers.encodeBytes32String("foobar"),
    ethers.solidityPacked(types, addrs));

  console.log('Parsing tx data:');
  console.log('method id', ethers.dataSlice(tx.data, 0, 4));
  console.log('label', ethers.toUtf8String(ethers.dataSlice(tx.data, 4, 36)));
  console.log('offset (bytes)', ethers.toNumber(ethers.getBytes(ethers.dataSlice(tx.data, 36, 68))));
  const len = ethers.toNumber(ethers.getBytes(ethers.dataSlice(tx.data,68,100)));
  console.log('payload size (bytes)', len);
  console.log('addresses:');
  for (let i = 100; i < len + 100; i += 20) {
    const k = ethers.dataSlice(tx.data,i,i + 20);
    console.log(k);
  }
})();
