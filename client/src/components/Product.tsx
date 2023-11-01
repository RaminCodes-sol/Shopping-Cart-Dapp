import { ethers } from "ethers"
import Rating from "./Rating"
import { ProductType } from "../types"


type PropsType = {
    product: ProductType,
    toggleModal: (product: ProductType) => void
}


function weiToUsd(wei: number) {
    // The conversion rate from wei to dollars.
    const weiToUsdRate = 1000000000; // 1 ETH = $1000
  
    // Convert wei to ether.
    const ether = wei / 1000000000000000000; // 1 ETH = 10^18 wei
  
    // Convert ether to dollars.
    const usd = ether * weiToUsdRate;
  
    return usd;
  }


const Product = ({ product, toggleModal }: PropsType ) => {

  return (
    <div onClick={() => toggleModal(product)} className='w-full flex flex-col gap-3 cursor-pointer border border-gray-500 p-4 rounded-md group'>

        <figure className='w-full h-full overflow-hidden'>
            <img src={product.image} alt='img' className='w-full h-full transition-transform group-hover:scale-110 duration-200'/>
        </figure>
        
        <small>{product.name}</small>

        <div className="flex justify-between items-center">
            <p>
                {/* Price: <span className='font-semibold text-xl'>{weiToUsd(Number(product.cost))}</span>  */}
                Price: <span className='font-semibold text-xl'>{ethers.formatEther(product.cost)}</span> 
                <span className='text-xs inline-block text-green-400'>ETH</span>
            </p>
            <div>
                { <Rating rating={Number(product.rating)} /> }
            </div>
        </div>

    </div>
  )
}

export default Product