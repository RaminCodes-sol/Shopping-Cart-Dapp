import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { BrowserProvider } from "ethers/providers"
import shoppingCart from './contract.json'
import Navbar from "./components/Navbar"
import Products from "./components/Products"
import { ProductType } from "./types"
import Cart from "./components/Cart"
import { useAppDispatch } from "./redux-features/store"
import { SET_PRODUCTS } from "./redux-features/CartSlice"



declare global {
  interface Window {
    ethereum?: any
  }
}


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("")
  const [state, setState] = useState<{
    provider: ethers.BrowserProvider | null,
    signer: ethers.JsonRpcSigner | null,
    contract: ethers.Contract | null
  }>({
    provider: null,
    signer: null,
    contract: null
  })

  const [showCart, setShowCart] = useState(false)
  const dispatch = useAppDispatch()



  // Connect Wallet
  const connectWallet = async () => {
    const { ethereum } = window

    if (ethereum) {
      try {
        const provider = new BrowserProvider(ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const accountAddress = await signer.getAddress()
        const contract = new ethers.Contract(shoppingCart.address, shoppingCart.abi, signer)

        setCurrentAccount(accountAddress)
        setState({ provider, signer, contract })
      } catch(error: any) {
        console.log("Error:", error.message)
      }
    }
  }

  // is Wallet Connected
  const isWalletConnected = async () => {
    if(window.ethereum) {
      try {
        const accounts = await window.ethereum?.request({method: "eth_accounts"})
        console.log("Connected Account:", accounts[0])
        setCurrentAccount(accounts[0])
      } catch (error: any) {
        console.log("Error:", error.message)
      }
    }
  }


  // Handle Accounts Changed 
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length > 0 && currentAccount !== accounts[0]) {
      setCurrentAccount(accounts[0])
      
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const accountAddress = await signer.getAddress()
      const contract = new ethers.Contract(shoppingCart.address, shoppingCart.abi, signer)

      setCurrentAccount(accountAddress)
      setState({ provider: state.provider, signer, contract })

    } else {
      setCurrentAccount("")
    }
  }


  // Load Products
  const loadProducts = async () => {
    const provider = new BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(shoppingCart.address, shoppingCart.abi, provider)

    let products = []

    for (let i = 0; i < 10; i++) {
      const product = await contract.products(i + 1)
      products.push({
        id: product.id.toString(),
        name: product.name.toString(),
        category: product.category.toString(),
        image: product.image.toString(),
        cost: product.cost.toString(),
        rating: product.rating.toString(),
        stock: product.stock.toString(),
      })
    }
    
    dispatch(SET_PRODUCTS(products))
  }


  useEffect(() => {
    loadProducts()
  }, [])


  useEffect(() => {
    isWalletConnected()

    // when accounts changed
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }
  
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [currentAccount])
  


  return (
    <main>
      <Navbar connectWallet={connectWallet } currentAccount={currentAccount} setShowCart={setShowCart} />
      <Products />
      { showCart && <Cart setShowCart={setShowCart} contract={state.contract} signer={state.signer} /> }
    </main>
  )
}

export default App
