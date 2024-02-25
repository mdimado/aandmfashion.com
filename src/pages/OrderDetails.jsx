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
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!auth.currentUser) {
          console.error('User not authenticated.');
          setLoadingOrder(false);
          return;
        }

        // Adjust the path to fetch order details based on the user and order IDs
        const orderRef = doc(db, 'users', auth.currentUser.uid, 'orders', orderId);
        const orderSnapshot = await getDoc(orderRef);

        if (!orderSnapshot.exists()) {
          console.error('Order not found.');
          setLoadingOrder(false);
          return;
        }

        console.log('Order Data:', orderSnapshot.data());

        setOrder({ id: orderSnapshot.id, ...orderSnapshot.data() });
        setOrderedProducts(orderSnapshot.data().items || []);
        setLoadingOrder(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const fetchOrderedProducts = async () => {
      try {
        const productPromises = orderedProducts.map((product) => fetchProductDetails(product.productId));
        const productDataList = await Promise.all(productPromises);
        setProductDataList(productDataList.filter(product => product !== null));
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error fetching ordered product details:', error);
        setLoadingProducts(false);
      }
    };

    if (orderedProducts.length > 0) {
      fetchOrderedProducts();
    } else {
      setLoadingProducts(false);
    }
  }, [orderedProducts]);

  const fetchProductDetails = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        console.error('Product not found for ID:', productId);
        return null;
      }

      return productSnapshot.data();
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  if (loadingOrder || loadingProducts) {
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
                    <img
                      src={productDataList[index]?.imgUrl ?? ''}
                      alt={productDataList[index]?.title ?? ''}
                      style={{ width: '50px' }}
                    />
                  </td>
                  <td>{productDataList[index]?.title ?? 'N/A'}</td>
                  <td>{`Rs. ${productDataList[index]?.price ?? 'N/A'}`}</td>
                  <td>{product.quantity ?? 'N/A'}</td>
                  <td>{`Rs. ${product.total ?? 'N/A'}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="order-total">Total Amount: Rs. {order.totalAmount ?? 'N/A'}</p>
          <p className="order-date">Order Date: {order.orderDate ?? 'N/A'}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;
