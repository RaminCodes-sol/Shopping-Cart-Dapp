import { useState, useEffect } from 'react'
import { ethers } from 'ethers';
import { useAppDispatch, useAppSelector } from "../redux-features/store"
import { DECREASE_AMOUNT, INCREASE_AMOUNT, REMOVE_FROM_CART } from "../redux-features/CartSlice";
import { IoClose } from "react-icons/io5"
import { HiPlusSm, HiMinusSm, HiTrash } from "react-icons/hi";




type PropsType = {
    setShowCart: React.Dispatch<React.SetStateAction<boolean>>,
    contract: ethers.Contract | null,
    signer: ethers.JsonRpcSigner | null,
}



const Cart = ({ setShowCart, contract, signer }: PropsType) => {
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalOrderedItems, seTotalOrderedItems] = useState(0)
    const { cartItems } = useAppSelector(state => state.shoppingCart)
    const dispatch = useAppDispatch()


    // Remove From Cart
    const removeFromCart = (itemId: number) => {
        dispatch(REMOVE_FROM_CART(itemId))
    }

    // Increase Amount
      const increaseAmount = (itemId: number) => {
        dispatch(INCREASE_AMOUNT(itemId))
    }

    // Decrease Amount
    const decreaseAmount = (itemId: number) => {
        dispatch(DECREASE_AMOUNT(itemId))
    }


    // Check out
    const checkOut = async () => { 
        const responseTx = await contract?.checkOut(totalPrice.toString(), cartItems, { value: totalPrice.toString() })
        await responseTx.wait()
        
        window.location.reload()
    }


    useEffect(() => {
        // Getting total price
        const { total, totalOrderedItems } = cartItems.reduce((acc, item) => {
            const { amount } = item
            const { cost } = item.item
            const totalAmount = amount * Number(cost)
            
            acc.total += totalAmount
            acc.totalOrderedItems += amount
            return acc
        }, {
            total: 0,
            totalOrderedItems: 0
        }) 

        setTotalPrice(total)
        seTotalOrderedItems(totalOrderedItems)
    }, [cartItems])
    


  return (
    <aside className="max-w-screen max-h-screen top-0 left-0 bottom-0 right-0 fixed z-20 bg-black/95 flex justify-center text-black">
        <section className="w-full sm:w-[450px] bg-black absolute top-0 bottom-0 right-0 text-white px-1">
            
            {/*------- Title -------*/}
            <header className="flex justify-between items-center text-white p-4 py-6 mb-2 border-b-2 border-b-black">
                <h3 className="text-xl font-semibold">items ordered: {totalOrderedItems}</h3>
                <button onClick={() => setShowCart(false)} className='bg-red-500 p-[.4rem] text-white text-2xl transition-colors hover:bg-red-600 rounded-md'><IoClose /></button>
            </header>


            {
                cartItems.length  === 0 ? <p className="text-center mt-10 text-xl font-medium">Cart is empty</p> : (
                    <>
                        {/*------- Cart Items -------*/}
                        <div>
                            <ul id="cartItems-container" className="h-[400px] px-5 overflow-y-scroll border-b-2 border-b-black">
                                {
                                    cartItems.length && cartItems?.map(item => (
                                        <li key={item.item.id} className="flex justify-between items-center mb-3 border border-gray-600 px-3 py-2 text-white rounded-md">
                                            <figure className="w-[80px] h-[80px]">
                                                <img src={item.item.image} alt='img' className="w-full h-full object-cover"/>
                                            </figure>
                                            
                                            <div>
                                                <h4 className="font-semibold text-lg">{item.item.name}</h4>
                                                <small>{ethers.formatEther(item.item.cost)} ETH</small>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button onClick={() => decreaseAmount(Number(item.item.id))} className="bg-green-500 rounded-full p-[.3rem] text-xl text-white transition-colors hover:bg-green-600"><HiMinusSm /></button>
                                                <span className="text-xl">{item.amount}</span>
                                                <button onClick={() => increaseAmount(Number(item.item.id))}className="bg-green-500 rounded-full p-[.3rem] text-xl text-white transition-colors hover:bg-green-600"><HiPlusSm /></button>
                                            </div>

                                            <button onClick={() => removeFromCart(Number(item.item.id))} className="bg-red-500 p-2 rounded-md text-white text-xl transition-colors hover:bg-red-600"><HiTrash /></button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        {/*------- Check Out -------*/}
                        <div className='px-2 mt-6 flex justify-between flex-col gap-5'>
                            <div>
                                <strong>Total Price: </strong>
                                <strong className='text-xl'>{ethers.formatEther(totalPrice.toString())}<small className='text-sm ml-[0.09rem]'>ETH</small></strong>
                            </div>

                            <button onClick={checkOut} className='bg-green-500 w-full p-3 text-white font-semibold text-xl transition-colors hover:bg-green-600 rounded-md'>CheckOut</button>
                        </div>
                    </>
                )
            }
            


        </section>
    </aside>
  )
}

export default Cart