import { ethers } from 'ethers'
import { ProductType } from '../types'
import { IoClose } from "react-icons/io5"
import Rating from './Rating'
import { useAppDispatch, useAppSelector } from '../redux-features/store'
import { ADD_TO_CART, REMOVE_FROM_CART } from '../redux-features/CartSlice'




type PropsType = {
    toggleModal: (product: ProductType) => void
    selectedItem: ProductType
}


const Modal = ({ toggleModal, selectedItem }: PropsType) => {
    const dispatch = useAppDispatch()

    const {cartItems}= useAppSelector(state => state.shoppingCart)
    

    // Add To Cart
    const addToCart = async () => {
        dispatch(ADD_TO_CART(selectedItem))
    }

    // Remove From Cart
    const removeFromCart = (itemId: number) => {
        dispatch(REMOVE_FROM_CART(itemId))
    }




  return (
    <section className="w-screen h-screen top-0 left-0 bottom-0 right-0 fixed z-20 bg-black/95 flex justify-center p-5">
        <div className="w-full max-w-[1000px] mx-auto p-2">
            
            {/*------- Navbar -------*/}
            <div className="w-full flex justify-between items-center px-3 py-1 pb-5 border-b border-b-gray-500">
                <h1 className="text-2xl font-semibold">DappCommerce</h1>
                <button onClick={() => toggleModal({} as ProductType)} className="bg-red-500 w-[40px] h-[40px] text-2xl transition-colors rounded-md hover:bg-red-600"><IoClose /></button>
            </div>


            {/*------- Contents -------*/}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-7">
                {/* ---- Image-LeftSide ---- */}
                <figure className="w-full h-[500px] p-10">
                    <img src={selectedItem.image} alt='img' className="w-full h-[200px] object-cover md:h-full" />
                </figure>

                {/* ---- Details-RightSide ---- */}
                <div className="px-5 py-8 flex flex-col gap-3">
                    {/* Item_Name */}
                    <h1 className="text-3xl font-semibold">{selectedItem.name}</h1>

                    {/* Item_Price-&-Rating */}
                    <div className="flex justify-between items-center">
                        <p>
                            Price: <span className='font-semibold text-xl'>{ethers.formatEther(selectedItem.cost)} </span> 
                            <span className='text-xs inline-block text-green-400'>ETH</span>
                        </p>
                        <Rating rating={Number(selectedItem.rating)}/>
                    </div>

                    {/* Item_Description*/}
                    <div className="mt-3">
                        <p>Introducing the new and improved XYZ product, designed to provide unparalleled performance and reliability with cutting-edge technology, sleek design, and advanced features for ultimate productivity and entertainment.</p>
                    </div>
                        
                    {/* Item_OrderDetails */}
                    <div className="flex flex-col gap-2 mt-4">
                        {
                            // order 
                            //     ? (
                            //         <p className="text-xl text-orange-400">Item Bought On: <strong>{ new Date(Number(order.time.toString() + '000')).toLocaleDateString(undefined, {weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric'}) }</strong></p>
                            //     )
                            //     : 
                            (
                                    <>
                                        <p>Free Delivery: <span className="text-pink-500 mb-3 inline-block">{ new Date(Date.now() + 345600000).toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'}) }</span></p>

                                        <p>{ Number(selectedItem.stock) > 0 ? <span className="text-green-500">In Stock - <strong>{selectedItem.stock}</strong> items Left</span> : <span className="text-red-500">Out Of Stock</span> }</p>

                                        {
                                            Number(selectedItem.stock) > 0 && (
                                                cartItems?.some(item => item.item.id === selectedItem.id) 
                                                    ? <button onClick={() => removeFromCart(Number(selectedItem.id))} className="bg-red-500 p-3 mt-6 text-lg rounded-sm transition-colors hover:bg-red-600">Remove From Cart</button>
                                                    : <button onClick={() => addToCart()} className="bg-orange-500 p-3 mt-6 text-lg rounded-sm transition-colors hover:bg-orange-600">Add To Cart</button>
                                            )
                                        }
                                    </>
                                )
                        }
                    </div>
                </div>
            </div>

        </div>
    </section>
  )
}

export default Modal