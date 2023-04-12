import { ethers } from "ethers";
import hre from "hardhat";
import { uniswapRouterV3Address, uniswapRouterV3ABI, wethAddress, wethABI } from "../utils/uniswap";
import { icosaAddress, icosaABI } from "../utils/icosa";
import { hexAddress, hexABI } from "../utils/hex";

async function main() {
  // Your local account
  const [owner] = await hre.ethers.getSigners();

  // Create a contract instance for the Uniswap V3 router
  const hexToken = new ethers.Contract(hexAddress, hexABI, owner);
  const wethToken = new ethers.Contract(wethAddress, wethABI, owner);
  const icosa = new ethers.Contract(icosaAddress, icosaABI, owner);
  const uniswapV3Router = new ethers.Contract(uniswapRouterV3Address, uniswapRouterV3ABI, owner);

  // Wrap Ether into WETH
  const wrapAmount = ethers.utils.parseEther("1"); // Wrap 1 Ether
  const wrapTx = await wethToken.deposit({ value: wrapAmount });
  await wrapTx.wait();

  // Approve the Uniswap V3 router to spend the wrapped Ether (WETH)
  const approveWeth = await wethToken.approve(uniswapRouterV3Address, wrapAmount);
  await approveWeth.wait();

  const approveHex = await hexToken.approve(uniswapRouterV3Address, 2074340783033);
  await approveHex.wait();

  const approveIcosa = await icosa.approve(uniswapRouterV3Address, 20743407830330);
  await approveIcosa.wait();
  // Set slippage, deadline, and the amount of Ether to swap
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // Deadline set to 20 minutes from now

  const swapParams = {
    tokenIn: hexAddress,
    tokenOut: icosaAddress,
    fee: 3000,
    recipient: owner.address,
    deadline,
    amountIn: 2000040783033,
    amountOutMinimum: 10,
    sqrtPriceLimitX96: 0,
  }

  // Execute the swap
  const tx = await uniswapV3Router.exactInputSingle(
    swapParams,
    { value: 2000040783033, gasLimit: 250000 }
  );

  await tx.wait();
  console.log("Swap executed successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });