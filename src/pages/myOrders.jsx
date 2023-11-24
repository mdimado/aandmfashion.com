import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { useSelector } from 'react-redux';
import useAuth from '../custom-hooks/useAuth';
import useGetData from '../custom-hooks/useGetData';
import '../styles/myOrders.css';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { currentUser } = useAuth(); // Use the useAuth hook to get the current user
  const uid = currentUser?.uid; // Access the uid property safely

  const { data: orders, loading } = useGetData(`users/${uid}/orders`); // Use the useGetData hook to fetch user orders

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row>
        <Col lg="12">
          <h3 className="my-4">My Orders</h3>
          {orders.length === 0 ? (
            <div className='middle'>
              <p>You haven't placed any orders yet.</p>
              <Link to="/shop" className="buy__button">Shop Now</Link>
            </div>
          ) : (
            <Table striped>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Name</th>
                  <th>Payment Method</th>
                  <th>Total Amount</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orderDetails/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{order.name}</td>
                    <td>{order.paymentMethod}</td>
                    <td>Rs. {order.totalAmount}</td>
                    <td>{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyOrders;
