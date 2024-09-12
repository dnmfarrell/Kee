Kee
---
A smart contract that packs labeled addresses on-chain. Has no state and emits no events to minimize gas costs. Only pay for the calldata.

See `contracts/Kee.sol`.

Usage
-----
Run the contract tests with hardhat:

    npx hardhat test

Deploy the contract locally, send it a transaction and print out the data:

    npx hardhat run scripts/tx-mint.js

