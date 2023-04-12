import hre from "hardhat";
import { ethers } from "ethers";
import { hedronABI, hedronAddress, } from "../utils/hedron";
import { icosaABI, icosaAddress } from "../utils/icosa";
import { hexABI, hexAddress } from "../utils/hex";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const hex = new ethers.Contract(hexAddress, hexABI, owner);
  const hexBalance = await hex.balanceOf(owner.address);
  const hexTotalSupply = await hex.totalSupply();

  const hedron = new ethers.Contract(hedronAddress, hedronABI, owner);
  const hedronBalance = await hedron.balanceOf(owner.address);
  const hedronTotalSupply = await hedron.totalSupply();

  const icosa = new ethers.Contract(icosaAddress, icosaABI, owner);
  const icosaBalance = await icosa.balanceOf(owner.address);
  const icosaTotalSupply = await icosa.totalSupply();

  console.log("OWNER:", owner.address);
  console.log("HEX:", hexBalance, hexTotalSupply);
  console.log("HDRN:", hedronBalance, hedronTotalSupply);
  console.log("ICSA:", icosaBalance, icosaTotalSupply);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });