import React, { useEffect, useState } from 'react';
import './ProductList.css';

interface Products {
  id: string;
  name: string;
  url: string;
  image: string;
  brand: string;
  price: number;
  tags: string[];
}

function ProductList() {
  const [products, setProducts] = useState<Products[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('');
  const [cart, setCart] = useState<Products[]>([]);

  const FilterTags = [
    'toothpaste',
    'discount',
    'gel',
    'cookies',
    'creme',
    'comics',
    'book',
  ];

  useEffect(() => {
    fetch('products.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => alert(`something went wrong ${err}`));
  }, []);

  const handlePriceSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let order = e.target.value;
    setSortOrder(order);

    const sortedProducts = [...products];
    if (order === 'asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    }
    if (order === 'desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setProducts(sortedProducts);
  };

  const handleTabSelect = (tag: string) => {
    if (activeTab === tag) {
      setActiveTab('');
    } else {
      setActiveTab(tag);
    }
  };

  const filteredProducts = activeTab
    ? products.filter((product) => product.tags.includes(activeTab))
    : products;

  const handleAddToCart = (product: Products) => {
    setCart([...cart, product]);
  };

  return (
    <>
      <h3> Product List </h3>

      {/* Sorting Select */}
      <div className='product-sort'>
        <label>Sort by price : </label>
        <select value={sortOrder} onChange={handlePriceSort}>
          <option value='' disabled>
            Sort by price
          </option>
          <option value='asc'>Low to high</option>
          <option value='desc'>High to low</option>
        </select>
      </div>

      {/* Product Filter  */}
      <div className='filter-tab'>
        <button
          className={`tab ${activeTab === '' ? 'active' : ''}`}
          onClick={() => handleTabSelect('')}
        >
          All
        </button>
        {FilterTags.map((tag) => {
          return (
            <button
              key={tag}
              className={`tab ${activeTab === tag ? 'active' : ''}`}
              onClick={() => handleTabSelect(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className='product-grid'>
        {filteredProducts.map((product) => {
          return (
            <div key={product.id} className='product-card'>
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>{product.brand}</p>
              <p>${product.price}</p>
              <button onClick={() => handleAddToCart(product)}>
                Add to cart
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart */}
      <div className='cart'>
        <h3>Cart</h3>
        {cart.map((item) => {
          return (
            <p id={item.id}>
              {item.brand}-{item.name}-${item.price}
            </p>
          );
        })}
      </div>
    </>
  );
}

export default ProductList;
