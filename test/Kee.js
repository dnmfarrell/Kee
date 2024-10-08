const { expect } = require("chai");
const DeployKee = require("../ignition/modules/Deploy");

const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Kee contract", function () {
  async function deployKeeFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const { contract } = await ignition.deploy(DeployKee);
    await contract.waitForDeployment();
    return { contract, owner, addr1, addr2 };
  }

  describe("Transactions", function () {
    it("mint() succeeds", async function () {
      const { contract, owner, addr1, addr2 } =
        await loadFixture(deployKeeFixture);
      addrs = [
        await owner.getAddress(),
        await addr1.getAddress(),
        await addr2.getAddress(),
      ];
      label = "foo";
      bytes = ethers.encodeBytes32String(label);
      await contract.mint(
        bytes,
        ethers.solidityPacked(["address", "address", "address"], addrs),
      );
    });
  });
  describe("Calls", function () {
    it("pack() returns expected", async function () {
      const { contract, owner, addr1, addr2 } =
        await loadFixture(deployKeeFixture);
      addrs = [
        await owner.getAddress(),
        await addr1.getAddress(),
        await addr2.getAddress(),
      ];
      packed = await contract.pack(
        "abcdefghijklmnopqrstuvwxyz0123456789",
        addrs,
      );
      // long label is truncated to 32 bytes
      expect(ethers.toUtf8String(packed[0])).to.equal(
        "abcdefghijklmnopqrstuvwxyz012345",
      );
      expect(packed[1]).to.equal(
        ethers.solidityPacked(["address", "address", "address"], addrs),
      );
    });
    it("unpack() returns expected", async function () {
      const { contract, owner, addr1, addr2 } =
        await loadFixture(deployKeeFixture);
      addrs = [
        await owner.getAddress(),
        await addr1.getAddress(),
        await addr2.getAddress(),
      ];
      label = "foo";
      bytes = ethers.encodeBytes32String(label);
      packed = ethers.solidityPacked(["address", "address", "address"], addrs);
      padded = ethers.zeroPadBytes(packed, 64); // two 32 byte words
      [labelDecoded, [ownerDecoded, addr1Decoded, addr2Decoded]] =
        await contract.unpack(bytes, padded);
      expect(labelDecoded).to.equal(label);
      expect(ownerDecoded).to.equal(addrs[0]);
      expect(addr1Decoded).to.equal(addrs[1]);
      expect(addr2Decoded).to.equal(addrs[2]);
    });
  });
});
