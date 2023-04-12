import { ethers } from "hardhat";

async function main() {
  const Piroshki = await ethers.getContractFactory("Piroshki");
  const piroshki = await Piroshki.deploy();

  await piroshki.deployed();

  console.log("Piroshki was deployed to:", piroshki.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
