const { ethers } = require("ethers");
const DeployKee = require("../ignition/modules/Deploy");

// Deploys the Kee contract and calls mint() to create a transaction and prints
// the transaction data.

const NUM_ADDRESSES = 10;

(async () => {
  const { contract } = await ignition.deploy(DeployKee);
  await contract.waitForDeployment();
  let types = [];
  let addrs = [];
  for (let i = 0; i < NUM_ADDRESSES; i++) {
    types.push("address");
    addrs.push(ethers.Wallet.createRandom().address);
  }
  const tx = await contract.mint(
    ethers.encodeBytes32String("foobar"),
    ethers.solidityPacked(types, addrs),
  );

  console.log("Parsing tx data:");
  console.log("method id", ethers.dataSlice(tx.data, 0, 4));
  console.log("label", ethers.toUtf8String(ethers.dataSlice(tx.data, 4, 36)));
  console.log(
    "offset (bytes)",
    ethers.toNumber(ethers.getBytes(ethers.dataSlice(tx.data, 36, 68))),
  );
  const len = ethers.toNumber(
    ethers.getBytes(ethers.dataSlice(tx.data, 68, 100)),
  );
  console.log("payload size (bytes)", len);
  console.log("addresses:");
  for (let i = 100; i < len + 100; i += 20) {
    const k = ethers.dataSlice(tx.data, i, i + 20);
    console.log(k);
  }
})().catch(console.error);
