import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/product-card.css';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../redux/slices/cartSlice';
import { favActions } from '../../redux/slices/favSlice';

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const addToCart = () => {
    if (item.availableSizes && item.availableSizes.length > 0) {
      if (!selectedSize) {
        toast.error('Please select a size.');
        return;
      }
    }
    if (item.availableColors && item.availableColors.length > 0) {
      if (!selectedColor) {
        toast.error('Please select a color.');
        return;
      }
    }

    const newItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      imgUrl: item.imgUrl,
      quantity: 1,
      availableSizes: item.availableSizes,
    };

    dispatch(cartActions.addItem(newItem));

    toast.success('Product added successfully');
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const addToFavorites = () => {
    dispatch(
      favActions.addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        imgUrl: item.imgUrl,
        availableSizes: item.availableSizes,
      })
    );

    toast.success('Product Added to Favorites');
  };

  return (
    <Col lg='3' md='4' className='mb-2 grey'>
      <div className='product__item'>
        <Link to={`/shop/${item.id}`}>
          <div className='product__img'>
            <motion.img
              whileHover={{ scale: 0.9 }}
              src={item.imgUrl}
              alt=''
              style={{ height: 400, objectFit: 'contain' }}
            />
            <div className='discount__circle'>
              <span className='discount__percentage'>- 12%</span>
            </div>
          </div>
        </Link>
        <div className='p-2 product__info'>
          <Link to={`/shop/${item.id}`}>
            <h3 className='product__name'>{item.title}</h3>
          </Link>
          <span>{item.category}</span>
          {item.availableSizes && item.availableSizes.length > 0 && (
            <div>
              <label>Select Size:</label>
              <div className='size__buttons'>
                {item.availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`size__button ${
                      selectedSize === size ? 'selected' : ''
                    }`}
                    onClick={() => handleSizeSelection(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          {item.availableColors && item.availableColors.length > 0 && (
            <div>
              <label>Select Color:</label>
              <div className='color__buttons'>
                {item.availableColors.map((color) => (
                  <button
                    key={color}
                    className={`color__button ${
                      selectedColor === color ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelection(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='product__card-bottom d-flex align-items-center justify-content-between p-2'>
          <span className='price'>Rs.{item.price}</span>
          <motion.span
            className='h_a'
            whileHover={{ scale: 1.2 }}
            onClick={addToFavorites}
          >
            <i className='helo ri-heart-add-line'></i>
          </motion.span>
          <motion.span
            className=''
            whileHover={{ scale: 1.2 }}
            onClick={addToCart}
          >
            <i  className='ri-add-line'></i>
          </motion.span>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
