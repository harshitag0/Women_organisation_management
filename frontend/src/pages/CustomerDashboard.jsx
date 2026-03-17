import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  });

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

  const fetchOrdersAndProducts = async () => {
    try {
      // Fetch user's orders
      const ordersRes = await axios.get('/api/orders/myorders');
      setOrders(ordersRes.data);
      
      // Calculate order stats
      const stats = {
        total: ordersRes.data.length,
        pending: ordersRes.data.filter(o => o.status === 'Pending').length,
        processing: ordersRes.data.filter(o => o.status === 'Processing').length,
        shipped: ordersRes.data.filter(o => o.status === 'Shipped').length,
        delivered: ordersRes.data.filter(o => o.status === 'Delivered').length
      };
      setOrderStats(stats);

      // Fetch products
      const productsRes = await axios.get('/api/products');
      setProducts(productsRes.data.slice(0, 6));
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  };

  return (
    <Container className="mt-4 mb-5">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '600', color: 'var(--text-dark)' }}>
          Welcome back, <span style={{ color: 'var(--accent)' }}>{userInfo?.name}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Manage your orders and explore our marketplace</p>
      </div>

      {/* Quick Action Cards */}
      <Row className="g-4 mb-5">
        <Col xs={12} sm={6} lg={4}>
          <Card style={{ 
            border: 'none', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }} 
            className="dashboard-card"
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}>
            <Card.Body className="text-center d-flex flex-column" style={{ flex: 1 }}>
              <i className="fas fa-shopping-bag fa-3x mb-3" style={{ color: '#2563eb' }}></i>
              <Card.Title style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 8 }}>My Orders</Card.Title>
              <Card.Text style={{ color: 'var(--text-muted)', fontSize: '.95rem', marginBottom: 16, flex: 1 }}>View and track your previous orders.</Card.Text>
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>{orderStats.total}</div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>Total Orders</div>
              </div>
              <Button variant="primary" className="w-100" onClick={() => navigate('/orders')} style={{ marginTop: 'auto' }}>View Orders</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} sm={6} lg={4}>
          <Card style={{ 
            border: 'none', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
            className="dashboard-card"
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}>
            <Card.Body className="text-center d-flex flex-column" style={{ flex: 1 }}>
              <i className="fas fa-store fa-3x mb-3" style={{ color: '#16a34a' }}></i>
              <Card.Title style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 8 }}>Shop Products</Card.Title>
              <Card.Text style={{ color: 'var(--text-muted)', fontSize: '.95rem', marginBottom: 16, flex: 1 }}>Browse handmade products from Bachatgats.</Card.Text>
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>{products.length}</div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>Products Available</div>
              </div>
              <Button variant="success" className="w-100" onClick={() => navigate('/shop')} style={{ marginTop: 'auto' }}>Go to Shop</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Card style={{ 
            border: 'none', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
            className="dashboard-card"
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}>
            <Card.Body className="text-center d-flex flex-column" style={{ flex: 1 }}>
              <i className="fas fa-user-edit fa-3x mb-3" style={{ color: '#0891b2' }}></i>
              <Card.Title style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 8 }}>My Profile</Card.Title>
              <Card.Text style={{ color: 'var(--text-muted)', fontSize: '.95rem', marginBottom: 16, flex: 1 }}>Update your account details and addresses.</Card.Text>
              <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>✓</div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>Account Active</div>
              </div>
              <Button variant="info" className="w-100 text-white" style={{ marginTop: 'auto' }}>Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Summary Stats */}
      {!loading && orderStats.total > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: 16 }}>Order Summary</h3>
          <Row className="g-3">
            <Col xs={6} md={2.4}>
              <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #2563eb' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2563eb' }}>{orderStats.total}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Total Orders</div>
              </div>
            </Col>
            <Col xs={6} md={2.4}>
              <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f59e0b' }}>{orderStats.pending}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Pending</div>
              </div>
            </Col>
            <Col xs={6} md={2.4}>
              <div style={{ padding: '16px', background: '#dbeafe', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3b82f6' }}>{orderStats.processing}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Processing</div>
              </div>
            </Col>
            <Col xs={6} md={2.4}>
              <div style={{ padding: '16px', background: '#dbeafe', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #0ea5e9' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0ea5e9' }}>{orderStats.shipped}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Shipped</div>
              </div>
            </Col>
            <Col xs={6} md={2.4}>
              <div style={{ padding: '16px', background: '#dcfce7', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #16a34a' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#16a34a' }}>{orderStats.delivered}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Delivered</div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* Recent Orders */}
      {!loading && orders.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Recent Orders</h3>
            <Link to="/orders">
              <Button variant="outline-primary" size="sm">View All Orders</Button>
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '.9rem' }}>Order ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '.9rem' }}>Items</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '.9rem' }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '.9rem' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '.9rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => navigate(`/orders/${order._id}`)}>
                    <td style={{ padding: '12px', fontSize: '.9rem', fontWeight: '500' }}>{order._id.substring(0, 8)}...</td>
                    <td style={{ padding: '12px', fontSize: '.9rem' }}>{order.items.length} item(s)</td>
                    <td style={{ padding: '12px', fontSize: '.9rem', fontWeight: '600' }}>₹{order.total_amount}</td>
                    <td style={{ padding: '12px' }}>
                      <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td style={{ padding: '12px', fontSize: '.9rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Featured Products */}
      {!loading && products.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Featured Products</h3>
            <Link to="/shop">
              <Button variant="outline-success" size="sm">Browse More</Button>
            </Link>
          </div>
          <Row className="g-3">
            {products.map(product => (
              <Col xs={12} sm={6} md={4} key={product._id}>
                <Card style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}>
                  <div style={{ height: '180px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {product.image_url && !product.image_url.includes('placeholder') ? (
                      <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className="fas fa-image" style={{ fontSize: '3rem', color: '#d1d5db' }}></i>
                    )}
                    <Badge bg="primary" style={{ position: 'absolute', top: 8, right: 8 }}>{product.category}</Badge>
                  </div>
                  <Card.Body>
                    <Card.Title style={{ fontSize: '.95rem', fontWeight: '600', marginBottom: 4 }}>{product.name}</Card.Title>
                    <Card.Text style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </Card.Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)' }}>₹{product.price}</span>
                      <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>Stock: {product.quantity}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: 'var(--accent)' }} />
          <p className="mt-3" style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
        </div>
      )}
    </Container>
  );
};

export default CustomerDashboard;
