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
                  <th>Order Details</th>
                  
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  
                    
                  <Link to={`/orderDetails/${order.id}`}><div className='orderbox'> 
                        <div>
                          <p>Order Id:</p>{order.id}
                        </div>
                        <div>
                          <p>Ordered by</p> {order.name}
                        </div>
                        <div>
                          <p>Total Amount</p> Rs.{order.totalAmount}
                        </div>
                        <div>
                          <p>Payment method</p> {order.paymentMethod}
                        </div>
                        <div>
                          <p>Order date</p> {order.orderDate}
                        </div>
                      </div></Link>
                    
                    
                  
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



