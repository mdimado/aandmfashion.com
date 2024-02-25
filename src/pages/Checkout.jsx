import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/checkout.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { getMessaging, getToken, sendMessage } from 'firebase/messaging';
import { doc, getDoc } from 'firebase/firestore';



const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const [show, setShow] = useState(false);
  const adminPhoneNumber = 'whatsapp:+919346401198'; 

  const delfee = Math.floor((totalAmount * 18) / 100);
  const taxes = Math.floor(totalAmount * (12 / 100) - totalAmount * (8 / 100));

  // State to hold the user ID
  const [userId, setUserId] = useState(null);

  // Effect to check the authentication state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update the user ID state with the current user's UID
        setUserId(user.uid);
      } else {
        // User is not signed in or signed out, reset the user ID state
        setUserId(null);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }

      if (phone.length !== 13) {
        toast.error('Phone number should be 10 digits long');
        return;
      }

      if (name.length < 3) {
        toast.error('Name should have a minimum of 3 characters');
        return;
      }

      if (!/^\d{6}$/.test(zipCode)) {
        toast.error('Zip code should be a 6-digit number');
        return;
      }

      setLoading(true);

      if (paymentMethod === 'cod') {
        if (!userId) {
          toast.error('User not authenticated. Please log in first.');
          setLoading(false);
          return;
        }

        const ordersRef = collection(db, 'users', userId, 'orders');
        const ordersRef2 = collection(db, 'orders');
        const orderData = {
          name: name,
          email: email,
          phone: phone,
          address: address,
          city: city,
          state: state,
          zipCode: zipCode,
          paymentMethod: paymentMethod,
          items: cartItems,
          totalAmount: totalAmount,
          orderDate: new Date().toLocaleString(),
        };

      
 
       //notify admin via notification here
        
        const docRef = await addDoc(ordersRef, orderData);
        const docRef2 = await addDoc(ordersRef2, orderData);

        

        toast.success('Order placed successfully');
        dispatch(cartActions.clearCart());

        navigate('/orderplaced', {
          state: { orderId: docRef.id, orderData, cartItems, totalAmount },
          state: { orderId: docRef2.id, orderData, cartItems, totalAmount },
        });
      } else if (paymentMethod === 'online') {
        navigate('/payment');
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error placing order');
    }
  };

  return (
    <section>
      <Container>
        <Row>
          
          <Col lg="8">
            <h4 className="mb-3">Delivery Details</h4>
            <Form className="billing__form" onSubmit={handlePlaceOrder}>
              <FormGroup className="form__group">
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </FormGroup>
              <FormGroup className="form__group">
                <label>Phone</label>
                <PhoneInput
                  defaultCountry="IN"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  inputStyle={{ width: '100%' }}
                  inputProps={{
                    required: true,
                  }}
                />
              </FormGroup>
              <FormGroup className="form__group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </FormGroup>
              <FormGroup className="form__group">
                <label>Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
              </FormGroup>
              <FormGroup className="form__group">
                <label>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              </FormGroup>
              <FormGroup className="form__group">
                <label>State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
              </FormGroup>
              <FormGroup className="form__group">
                <label>Zip Code</label>
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
              </FormGroup>
              <h4 className="mb-3">Choose Payment Method</h4>
              <FormGroup>
                <label>
                  <input
                    type="checkbox"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  (COD) Cash on Delivery
                </label>
              </FormGroup>
              <FormGroup>
                <label>
                 
                 Online payment is not available at the moment
                </label>
              </FormGroup>
              {paymentMethod === 'online' ? (
                <button onClick={() => setShow(true)} className="buy__button w-100" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Proceed to Pay'}
                </button>
              ) : null}
              {paymentMethod === 'cod' ? (
                <button className="buy__button w-100" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              ) : null}
            </Form>
          </Col>

          <Col lg="4">
            <h4>Order Summary</h4>
            <div className="table_total">
              <table width="100%" className="table tableo table-borderd w-100">
                <thead>
                  <tr>
                    <th className="text-center">Product</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const finalprice = item.price * item.quantity;
                    return (
                      <tr key={item.id}>
                        <td className="text-center">{item.title} ({item.size}) {item.color && <><span>(</span><span style={{ marginLeft: "5px", backgroundColor: item.color, width: "10px", height: "10px",borderRadius:"20px", display: "inline-block" }}></span></>}
          {item.color && <span> {item.color})</span>}</td>
                        <td className="text-center">Rs.{item.price}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">Rs.{finalprice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="divvvv">
              <p>Total Amount:</p>
              <p className="ppp"> Rs.{totalAmount}</p>
            </div>
            <div className="divvvv">
              <p>Taxes</p>
              <p className="ppp"> Rs.{taxes}</p>
            </div>
            <div className="divvvv">
              <p>Delivery charges</p>
              <p className="ppp">
                <s>Rs.{Math.floor(delfee)}</s>FREE
              </p>
            </div>
            <div className="divvvv">
              <p>Additional discount</p>
              <p className="ppp"> - Rs.{taxes}</p>
            </div>
            <div className="divvvv line_below">
              <h3>Total Amount:</h3>
              <h3 className="ppp"> Rs.{totalAmount}</h3>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Checkout;
