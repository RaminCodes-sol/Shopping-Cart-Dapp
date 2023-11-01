import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ShoppingCart } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractTransactionResponse } from "ethers";



/*----- Convert Eth To Wei -----*/
const convertEthToWei = (value:string) => {
  return ethers.parseUnits(value, 'ether')
}

/*----- function args -----*/
const ID = 1
const NAME = "Hat"
const CATEGORY = 'CLothing'
const IMAGE = "https://bafybeifsp2j32rct2ry5sk4bqrelutv2twq4ipu5nuwpzpsiqvnatkjfve.ipfs.nftstorage.link/?filename=image+%283%29.jpg"
const COST = convertEthToWei("0.002")
const RATING = 3
const STOCK = 5



describe("Shopping Cart", () => {
  let shoppingCart: ShoppingCart
  let deployer: HardhatEthersSigner
  let buyer: HardhatEthersSigner

  beforeEach(async () => {
    shoppingCart = await ethers.deployContract("ShoppingCart");
    await shoppingCart.waitForDeployment();

    [deployer, buyer] = await ethers.getSigners()
  })


  /*-------- Development -------*/ 
  describe("Development", () => {
    it("Should set the right owner", async () => {
      expect(await shoppingCart.owner()).to.equal(deployer.address)
    })
  })
  

  /*-------- Listing Product -------*/
  describe('Listing Product', () => {
    let responseTx: ContractTransactionResponse

    beforeEach(async () => {
      // List Product
      responseTx = await shoppingCart.connect(deployer).listProduct(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await responseTx.wait()
    })

    it("Should fail if the caller is not the owner", async () => {
      await expect(shoppingCart.connect(buyer).listProduct(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)).to.be.revertedWith("Only the owner can list products")
    })

    it("Should Add product", async () => {
      const product = await shoppingCart.products(1)

      expect(product.id).to.equal(ID)
      expect(product.name).to.equal(NAME)
      expect(product.category).to.equal(CATEGORY)
      expect(product.image).to.equal(IMAGE)
      expect(product.cost).to.equal(COST)
      expect(product.rating).to.equal(RATING)
      expect(product.stock).to.equal(STOCK)
    })

    it("Should emit ProductListed event", async () => {
      await expect(responseTx).to.emit(shoppingCart, "ProductListed").withArgs(ID, NAME, STOCK)
    })
  })


  /*-------- Checking Out -------*/
  describe("Checking Out", () => {
    let responseTx: ContractTransactionResponse

    const cartItems = [
      {
        amount: 1,
        item: {
          id: ID ,
          name: NAME,
          category: CATEGORY,
          image: IMAGE,
          cost: COST,
          rating: RATING,
          stock: STOCK
        }
      }
    ]

    let deployerBalanceBefore: bigint

    beforeEach(async () => {
      // List Product
      responseTx = await shoppingCart.connect(deployer).listProduct(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await responseTx.wait()

      // Owner Balance Before
      deployerBalanceBefore = await ethers.provider.getBalance(deployer.address)

      // Checkout
      responseTx = await shoppingCart.connect(buyer).checkOut(COST, cartItems, { value: COST })
      await responseTx.wait()
    })

    it("Should fail if msg.value is less than totalPrice", async ()=> {
      await expect(shoppingCart.connect(buyer).checkOut(COST, cartItems, { value: ethers.parseEther("0.00001") })).to.be.revertedWith("Not enough funds to buy a product")
    })
    
    it("Should update owner balance", async () => {
      const deployerBalanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(deployerBalanceAfter).to.be.greaterThan(deployerBalanceBefore)
    })

    it("Should update buyer's order count", async () => {
      const buyerFirstOrderCount = await shoppingCart.orderCount(buyer.address)
      expect(buyerFirstOrderCount).to.equal(1)
    })

    it("Should add buyer's order", async () => {
      const orderId = await shoppingCart.orderCount(buyer.address) // order id is 1
      const orderedItem = await shoppingCart.orders(buyer.address, orderId)

      expect(orderedItem.time).to.equal(await time.latest())
      expect(orderedItem.item.id).to.equal(ID)
      expect(orderedItem.item.name).to.equal(NAME)
      expect(orderedItem.item.category).to.equal(CATEGORY)
      expect(orderedItem.item.image).to.equal(IMAGE)
      expect(orderedItem.item.cost).to.equal(COST)
      expect(orderedItem.item.rating).to.equal(RATING)
      expect(orderedItem.item.stock).to.equal(STOCK)
    })

    it("Should update product stock", async () => {
      const product = await shoppingCart.products(1)
      expect(product.stock).to.equal(STOCK - cartItems[0].amount)
    })

    it("Should emit ProductBought event", async () => {
      const productId = ID
      const orderId = await shoppingCart.orderCount(buyer.address)
      await expect(responseTx).to.emit(shoppingCart, "ProductBought").withArgs(buyer.address, orderId, productId)
    })
  })

})