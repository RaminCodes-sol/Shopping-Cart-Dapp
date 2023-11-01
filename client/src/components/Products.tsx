import { useState } from 'react'
import Modal from "./Modal"
import Product from "./Product"
import { ProductType } from '../types'
import { useAppSelector } from '../redux-features/store'




const Products = () => {
    const [showModal, setShowModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState<ProductType>({} as ProductType)
    const { products, searchedItems } = useAppSelector(state => state.shoppingCart)


    // Toggle Model
    const toggleModal = (product: ProductType) => {
        setSelectedItem(product)
        setShowModal(!showModal)
    }


  return (
    <section className="w-full max-w-[1150px] mx-auto px-5 pt-7 pb-12 mt-20">
        <h1 className="text-3xl pb-4">Products</h1>

        <div className="w-full grid grid-cols-fluid gap-4">
            {
                searchedItems.length > 0
                    ? searchedItems?.map(product => <Product key={product.id} product={product} toggleModal={toggleModal} />)
                    : products?.map(product => <Product key={product.id} product={product} toggleModal={toggleModal} />)
            }
        </div>
        
        { showModal && <Modal toggleModal={toggleModal} selectedItem={selectedItem} />}
    </section>
  )
}

export default Products