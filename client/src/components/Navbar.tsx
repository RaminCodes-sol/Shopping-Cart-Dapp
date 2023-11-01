import { useState, useEffect } from 'react'
import { BsCart4 } from "react-icons/bs"
import { useAppDispatch, useAppSelector } from '../redux-features/store'
import { SET_SEARCHED_ITEMS } from '../redux-features/CartSlice'




type Props = {
    connectWallet: () => void,
    currentAccount: string,
    setShowCart:  React.Dispatch<React.SetStateAction<boolean>>
}


const Navbar = ({ connectWallet, currentAccount, setShowCart }: Props) => {
    const [ searchValue, setSearchValue] = useState("")
    const { cartItems, products } = useAppSelector(state => state.shoppingCart)
    
    const dispatch = useAppDispatch()


    // get total items ordered
    const { total } = cartItems.reduce((acc, item) => {
        acc.total += item.amount
        return acc
    }, {
        total: 0
    })

    // Search Items
    const searchItems = () => {
        if (searchValue.length === 0) {
            dispatch(SET_SEARCHED_ITEMS(products))
        } else {
            const result = products.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()))
            dispatch(SET_SEARCHED_ITEMS(result))
        }
    }
    

    useEffect(() => {
        searchItems()
    }, [searchValue])


  return (
    <nav className='w-full px-4 sm:px-12 py-6 bg-black/90 fixed z-10 top-0 flex justify-between items-center'>

        {/*------- Search Input -------*/}
        <input 
            type="text" 
            placeholder="Search..." 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)}
            className='w-full max-w-[230px] sm:max-w-[300px] md:max-w-[400px] p-2 border-none outline-none text-black rounded-sm'
        />

        {/*------- Buttons -------*/}
        <div className='flex items-center justify-center gap-7'>
            <button disabled={!!currentAccount && true} onClick={() => connectWallet()} className='bg-[crimson] text-sm px-4 py-3 rounded-md transition-colors hover:bg-[#ed1c46]'>
                {
                    !currentAccount ? "Connect" : `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
                }
            </button>
            
            <div className='relative'>
                <button onClick={() => setShowCart(true)} className='bg-white px-3 py-2 text-2xl transition-colors hover:bg-black hover:text-white rounded-md text-black w-full h-full'><BsCart4 /></button>
                <span className='flex justify-center items-center absolute -bottom-3  left-0 text-sm bg-orange-500 w-[25px] h-[25px] pointer-events-none rounded-full'>{total}</span>
            </div>
        </div>
        
    </nav>
  )
}

export default Navbar