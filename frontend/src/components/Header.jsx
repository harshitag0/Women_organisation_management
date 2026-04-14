import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/shop?q=${searchQuery}`);
  };

  return (
    <header>
      <Navbar className="navbar-bachatgat" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Krantijyoti Mahila Gat</Navbar.Brand>
          </LinkContainer>

          <form onSubmit={handleSearch} className="d-none d-md-flex mx-auto">
            <input
              type="text"
              className="nav-search"
              placeholder="Search products, articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-1">
              <LinkContainer to="/">
                <Nav.Link><i className="fas fa-home me-1"></i> Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/shop">
                <Nav.Link><i className="fas fa-store me-1"></i> Marketplace</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/cart">
                <Nav.Link><i className="fas fa-shopping-cart me-1"></i> Cart</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contact">
                <Nav.Link><i className="fas fa-envelope me-1"></i> Contact Us</Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown
                  title={<span><i className="fas fa-user-circle me-1"></i>{userInfo.name}</span>}
                  id="username"
                  align="end"
                >
                  <LinkContainer to={`/${userInfo.role.toLowerCase()}`}>
                    <NavDropdown.Item><i className="fas fa-tachometer-alt me-2"></i>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="btn-signin-nav">Sign In</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
