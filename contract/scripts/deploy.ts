import { ethers } from "hardhat";
import { items } from "./products.json"


// Convert Eth To Wei
const convertEthToWei = (value: string) => {
  return ethers.parseUnits(value, "ether")
}

async function main() {

  // Accoun
  const [deployer] = await ethers.getSigners()

   // Deploy Contract
  const shoppingCart = await ethers.deployContract("ShoppingCart");
  await shoppingCart.waitForDeployment()


  console.log(`deployed to ${shoppingCart.target}`);

  for (let i = 0; i < items.length; i++) {
    const responseTx = await shoppingCart.connect(deployer).listProduct(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      convertEthToWei(items[i].cost),
      items[i].rating,
      items[i].stock,
    )
    await responseTx.wait()
    
    console.log(`Product id: ${items[i].id} and name: ${items[i].name}`)
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


