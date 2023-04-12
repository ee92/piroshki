import { ethers } from "ethers";
import hre from "hardhat";
import { uniswapRouterV3Address, uniswapRouterV3ABI, wethAddress, wethABI } from "../utils/uniswap";
import { hexAddress } from "../utils/hex";

async function main() {
  // Your local account
  const [owner] = await hre.ethers.getSigners();

  // Create a contract instance for the Uniswap V3 router
  const wethToken = new ethers.Contract(wethAddress, wethABI, owner);
  const uniswapV3Router = new ethers.Contract(uniswapRouterV3Address, uniswapRouterV3ABI, owner);

  // Wrap Ether into WETH
  const wrapAmount = ethers.utils.parseEther("1"); // Wrap 1 Ether
  const wrapTx = await wethToken.deposit({ value: wrapAmount });
  await wrapTx.wait();

  // Approve the Uniswap V3 router to spend the wrapped Ether (WETH)
  const approveTx = await wethToken.approve(uniswapRouterV3Address, wrapAmount);
  await approveTx.wait();

  // Set slippage, deadline, and the amount of Ether to swap
  const slippageTolerance = ethers.utils.parseUnits("1", 16); // 1% slippage tolerance
  const amountIn = ethers.utils.parseEther("1"); // Swap 1 Ether
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // Deadline set to 20 minutes from now

  const swapParams = {
    tokenIn: wethAddress,
    tokenOut: hexAddress,
    fee: 3000,
    recipient: owner.address,
    deadline,
    amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  }

  // Estimate the output amount
  const amountsOut = await uniswapV3Router.callStatic.exactInputSingle(swapParams);

  // Calculate the minimum amount of tokens to receive, considering the slippage tolerance
  const amountOutMinimum = amountsOut.mul(ethers.utils.parseUnits("1", 18).sub(slippageTolerance)).div(ethers.utils.parseUnits("1", 18));

  // Execute the swap
  const tx = await uniswapV3Router.exactInputSingle(
    { ...swapParams, amountOutMinimum },
    { value: amountIn, gasLimit: 250000 }
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