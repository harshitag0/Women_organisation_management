import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const BachatgatDashboard = () => {
   // Assuming existing Dashboard Code ... 
   // Here I'll create a simplified version focusing on Savings for demonstration 
   
  const { userInfo } = useContext(AuthContext);
  const [savings, setSavings] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Deposit');
  const [memberId, setMemberId] = useState(''); // Would typically be a dropdown from members list
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/savings', config);
        setSavings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavings();
  }, [userInfo.token]);

  const addSavingHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/savings', { member_id: memberId, amount, type }, config);
      setMessage('Transaction recorded successfully!');
      
      // Refresh savings list
      const { data } = await axios.get('/api/savings', config);
      setSavings(data);
    } catch (error) {
       setMessage(error.response?.data?.message || 'Error recording transaction');
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{userInfo?.name} (Bachatgat Dashboard)</h2>
      </div>

      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-success text-white">Record Transaction</Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={addSavingHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Member ID (Object ID For Now)</Form.Label>
                  <Form.Control type="text" value={memberId} onChange={(e) => setMemberId(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (₹)</Form.Label>
                  <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="Deposit">Deposit</option>
                    <option value="Withdrawal">Withdrawal</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="success" type="submit" className="w-100">Submit</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header>Recent Savings Transactions</Card.Header>
            <Card.Body>
              <Table striped bordered responsive hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Member</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {savings.map(saving => (
                    <tr key={saving._id}>
                      <td>{new Date(saving.date).toLocaleDateString()}</td>
                      <td>{saving.member_id?._id || saving.member_id || 'N/A'}</td>
                      <td className={saving.type === 'Deposit' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                        {saving.type}
                      </td>
                      <td>₹{saving.amount}</td>
                    </tr>
                  ))}
                  {savings.length === 0 && <tr><td colSpan="4" className="text-center">No transactions found.</td></tr>}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BachatgatDashboard;
