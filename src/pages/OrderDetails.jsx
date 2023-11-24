import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Table } from 'reactstrap';
import { db, auth } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/orderDetails.css';

const OrderDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [productDataList, setProductDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details
        const orderRef = doc(db, 'users', auth.currentUser.uid, 'orders', orderId);
        const orderSnapshot = await getDoc(orderRef);

        if (!orderSnapshot.exists()) {
          console.error('Order not found.');
          setLoading(false);
          return;
        }

        console.log('Order Data:', orderSnapshot.data());

        setOrder({ id: orderSnapshot.id, ...orderSnapshot.data() });

        // Use the items list from order data to populate orderedProducts
        setOrderedProducts(orderSnapshot.data().items || []);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const fetchOrderedProducts = async () => {
      try {
        // Use Promise.all to fetch product details for all ordered products
        const productPromises = orderedProducts.map((product) => fetchProductDetails(product.productId));
        const productDataList = await Promise.all(productPromises);
        setProductDataList(productDataList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ordered product details:', error);
      }
    };

    if (orderedProducts.length > 0) {
      fetchOrderedProducts();
    }
  }, [orderedProducts]);

  const fetchProductDetails = async (productId) => {
    const productRef = doc(db, 'products', productId);
    const productSnapshot = await getDoc(productRef);
    return productSnapshot.data();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row>
        <Col lg="12">
          <h3 className="my-4">Order Details for Order ID: {order.id}</h3>
          <Table striped>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderedProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>
                    <img src={productDataList[index].imgUrl} alt={productDataList[index].productName} style={{ width: '50px' }} />
                  </td>
                  <td>{productDataList[index].title}</td>
                  <td>Rs. {productDataList[index].price}</td>
                  <td>{product.quantity}</td>
                  <td>Rs. {product.total}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="order-total">Total Amount: Rs. {order.totalAmount}</p>
          <p className="order-date">Order Date: {order.orderDate}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;
