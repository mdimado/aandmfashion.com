import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from '../redux/slices/cartSlice';
import Helmet from '../components/Helmet/Helmet';
import CommonSection from '../components/UI/CommonSection';
import { db, auth } from "../firebase.config";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { favActions } from "../redux/slices/favSlice";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";


const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const cartItems = useSelector((state) =>
    state.cart.cartItems.map((item) => ({ ...item, size: item.size || "" }))
  );

  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isMoveToFavModalOpen, setMoveToFavModalOpen] = useState(false);
  const [itemToMoveToFav, setItemToMoveToFav] = useState(null);



  
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const fetchCartItems = async () => {
      try {
        const cartRef = doc(db, "users", user.uid);
        const cartSnapshot = await getCartSnapshot(cartRef);
        if (cartSnapshot.exists()) {
          const cartData = cartSnapshot.data();
          const cartItemsWithSizeRequired = cartData.cart.map((item) => ({
            ...item,
            id: `${item.id}-${item.size}`, // Include size in the item ID
            sizeRequired: item.sizeRequired === "Yes",
          }));
          dispatch(cartActions.setCartItems(cartItemsWithSizeRequired));
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), () => {
      fetchCartItems();
    });

    fetchCartItems();

    return () => unsubscribe();
  }, []);

  const getCartSnapshot = async (cartRef) => {
    try {
      const cartSnapshot = await getDoc(cartRef);
      return cartSnapshot;
    } catch (error) {
      console.error("Error getting cart snapshot:", error);
    }
  };

  const incrementQuantity = (itemId) => {
    dispatch(cartActions.incrementQuantity(itemId));
  };

  const decrementQuantity = (itemId) => {
    dispatch(cartActions.decrementQuantity(itemId));
  };

  const moveItemToFav = (item) => {
    setItemToMoveToFav(item);
    setMoveToFavModalOpen(true);
  };

  const handleMoveToFavConfirmation = () => {
    if (itemToMoveToFav) {
      dispatch(favActions.addItem(itemToMoveToFav));
      dispatch(cartActions.deleteItem(itemToMoveToFav.id));
      toast.success("Item moved to favorites");
      setMoveToFavModalOpen(false);
    }
  };


  const deleteProduct = (itemId) => {
    setItemToDelete(itemId);
    setDeleteModalOpen(true);
  };
  
  const handleDeleteConfirmation = () => {
    if (itemToDelete) {
      dispatch(cartActions.deleteItem(itemToDelete));
      toast.success("Item deleted from the cart");
      setDeleteModalOpen(false);
    }
  };
  
  
  

  return (
    <Helmet title="cart">
      <CommonSection title='Shopping Cart'  />
      <section>
        <Container>
          <Row>
            <Col className='carttable' lg='8'>
              {cartItems.length === 0 ? (
                <div className='justify cartbox'>
                  <h2 className="fs-4 text-center">No items added to the cart</h2>
                  <p className="text-center mt-5">Embark on a shopping adventure and fill your cart with exquisite treasures</p>
                </div>
              ) : (
                <section className='cart'>
                  <table width="100%" className="table bordered">
                    <thead>
                      <tr>
                        
                        
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <Tr
                          item={item}
                          key={index}
                          incrementQuantity={incrementQuantity}
                          decrementQuantity={decrementQuantity}
                          deleteProduct={deleteProduct}
                          moveItemToFav={moveItemToFav}
                        />
                      ))}
                    </tbody>
                  </table>
                </section>
              )}
            </Col>
            
            <Col className='pt-500' lg='3'>
              
            <div>
            <p className="fs-6 mt-2">taxes and shipping will be calculated during checkout</p>
                <h6 className="d-flex align-items-center justify-content-between">
                  Subtotal <span className="fs-4 fw-bold">Rs.{totalAmount}</span>
                </h6>
              </div>
              <Col className="sticky-bottomo ">
              <div className="button-no">
                {cartItems.length === 0 ? (
                  <button className="buy__buttonn button-no w-100 ">Proceed to Checkout</button>
                ) : (
                  <Link to='/checkout'><button className="buy__button w-100 ">Proceed to Checkout</button></Link>
                )}
                
              </div></Col>
            
            </Col>
          </Row>
        </Container>
      </section>
      {itemToDelete && (
      <Modal isOpen={isDeleteModalOpen} toggle={() => setDeleteModalOpen(false)}>
        <ModalHeader toggle={() => setDeleteModalOpen(false)}>
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete the item from your shopping cart?
        </ModalBody>
        <ModalFooter>
          <button className="buy__button btn-move-to-fav-cancel btn-danger" onClick={handleDeleteConfirmation}>
            Yes, Delete
          </button>
          <button className="buy__button btn-secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    )}
    {itemToMoveToFav && (
        <Modal
          isOpen={isMoveToFavModalOpen}
          toggle={() => setMoveToFavModalOpen(false)}
          className="move-to-fav-modal"
        >
          <ModalHeader toggle={() => setMoveToFavModalOpen(false)}>
            Confirm Move to Favorites
          </ModalHeader>
          <ModalBody className="move-to-fav-modal-body">
            Are you sure you want to move the item to your favorites?
          </ModalBody>
          <ModalFooter className="move-to-fav-modal-footer">
            <button
              className="buy__button btn-move-to-fav"
              onClick={handleMoveToFavConfirmation}
            >
              Yes, Move 
            </button>
            <button
              className="buy__button btn-move-to-fav-cancel"
              onClick={() => setMoveToFavModalOpen(false)}
            >
              Cancel
            </button>
          </ModalFooter>
        </Modal>
      )}
    </Helmet>
  );
};

const Tr = ({ item, incrementQuantity, decrementQuantity, deleteProduct, moveItemToFav }) => {
  return (
    <div className="cart-item">
      <div className="gridding">
        <div className="cart-item-image">
          <Link to={`/shop/${item.id.split("-")[0]}`}>
            <img src={item.imgUrl} alt="" />
          </Link>
        </div>
        <div className="cart-item-title">
          <Link to={`/shop/${item.id.split("-")[0]}`}>
            <h5>{item.title}</h5>
            {item.size && <span>({item.size})</span>}
            {item.color && (
              <>
                <span>(</span>
                <span
                  style={{
                    marginLeft: "5px",
                    borderRadius: "20px",
                    backgroundColor: item.color,
                    width: "10px",
                    height: "10px",
                    display: "inline-block",
                  }}
                ></span>
              </>
            )}
            {item.color && <span> {item.color})</span>}
          </Link>
          <div className="cart-item-details">
        
        <div className=" cart-item-price">Rs.{item.price}</div>
        <div className="all-in-one-ro">
        <div className="cart-item-quantity">
          <div className="quantity">
            <a className="quantity__minus" onClick={() => decrementQuantity(item.id)}>
              -
            </a>
            <span className="quantity__input">{item.quantity}</span>
            <a className="quantity__plus" onClick={() => incrementQuantity(item.id)}>
              +
            </a>
          </div>
        </div>
        <div className="cart-item-actions">
          <motion.i
            whileTap={{ scale: 1.2 }}
            onClick={() => deleteProduct(item.id)}
            className="ri-delete-bin-line"
          ></motion.i>
          <i onClick={() => moveItemToFav(item)} className="ri-heart-3-fill ml-5"></i>
        </div>
        </div>
      </div>
        </div>
      </div>
      
      
    </div>
  );
};



export default Cart;
