// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract ShoppingCart {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    // Events
    event ProductListed(uint256 _productId, string _name, uint256 _quantity);
    event ProductBought(address _buyerAddress, uint256 _orderId, uint256 _productId);


    // Product struct
    struct ProductStruct {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
    
    // Order struct
    struct OrderStruct {
        uint256 time;
        ProductStruct item;
    }
    
    // Cart struct
    struct CartStruct {
        uint256 amount;
        ProductStruct item;
    }

    // mappings
    mapping(uint256 => ProductStruct) public products;
    mapping(address => mapping(uint256 => OrderStruct)) public orders;
    mapping(address => uint256) public orderCount;
    

    /*------- List Product -------*/
    function listProduct (
        uint256 _id, 
        string memory _name, 
        string memory _category, 
        string memory _image, 
        uint256 _cost, 
        uint256 _rating, 
        uint256 _stock
    ) public {
        require(msg.sender == owner, "Only the owner can list products");

        ProductStruct memory newProduct = ProductStruct({
            id: _id,
            name: _name,
            category: _category,
            image: _image,
            cost: _cost,
            rating: _rating,
            stock: _stock
        });

        products[_id] = newProduct;
        
        emit ProductListed(_id, _name, _stock);
    }
    

    /*------- CheckOut -------*/
    function checkOut (uint256 _totalPrice, CartStruct[] memory _cartItems) public payable {
        require(msg.value >= _totalPrice, "Not enough funds to buy a product");

        (bool sent, ) = owner.call{value: _totalPrice}("");
        require(sent, "Transfering Failed");

        for (uint256 i = 0; i < _cartItems.length; i++) {
            ProductStruct memory product = products[_cartItems[i].item.id];

            OrderStruct memory newOrder = OrderStruct(block.timestamp, product);

            orderCount[msg.sender] += 1;
            orders[msg.sender][orderCount[msg.sender]] = newOrder;

            products[product.id].stock -= _cartItems[i].amount;

            emit ProductBought(msg.sender, orderCount[msg.sender], product.id);
        }
    }
}
