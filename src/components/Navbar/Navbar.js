import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { FaSearch, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import ProfileButton from '../ProfilButton/ProfilButton';
import { logout } from '../../store/slices/authSlice';
import './Navbar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Navigation dynamique selon le rôle
  const renderRoleBasedLinks = () => {
    if (!isAuthenticated) return null;

    // ✅ ÉTUDIANT
    if (user?.userType === 'student') {
      return (
        <>
          <Nav.Link as={Link} to="/stages">
            <FaSearch className="me-1" />
            Rechercher
          </Nav.Link>
          <Nav.Link as={Link} to="/mes-candidatures">
            Mes Candidatures
          </Nav.Link>
          <Nav.Link as={Link} to="/messages">
            <FaEnvelope className="me-1" />
            Messages
          </Nav.Link>
        </>
      );
    }

    // ✅ ENTREPRISE
    if (user?.userType === 'company') {
      return (
        <>
          <Nav.Link as={Link} to="/company/dashboard">
            Tableau de bord
          </Nav.Link>
          <Nav.Link as={Link} to="/company/post-stage">
            Publier une offre
          </Nav.Link>
          <Nav.Link as={Link} to="/company/applications">
            Candidatures
          </Nav.Link>
          <Nav.Link as={Link} to="/company/messages">
            <FaEnvelope className="me-1" />
            Messages
          </Nav.Link>
        </>
      );
    }

    // ✅ ADMIN
    if (user?.userType === 'admin') {
      return (
        <>
          <Nav.Link as={Link} to="/admin/dashboard">
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/users">
            Utilisateurs
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/stages">
            Stages
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/companies">
            Entreprises
          </Nav.Link>
        </>
      );
    }
  };

  return (
    <BSNavbar expand="lg" className="navbar" variant="dark" style={{
      background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
      boxShadow: '0 2px 15px rgba(0, 102, 204, 0.15)'
    }}>
      <Container>
        <BSNavbar.Brand as={Link} to="/" style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}>
          <FaBriefcase className="me-2" />
          StageFinder
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              padding: '0.5rem 1rem',
              borderRadius: '8px'
            }}>
              Accueil
            </Nav.Link>
            
            {renderRoleBasedLinks()}
            
            {isAuthenticated ? (
              <ProfileButton onLogout={handleLogout} />
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  Connexion
                </Nav.Link>
                <Link to="/register">
                  <button className="btn btn-success ms-2" style={{
                    backgroundColor: '#00C853',
                    borderColor: '#00C853',
                    borderRadius: '10px',
                    padding: '0.5rem 1.5rem',
                    fontWeight: '600'
                  }}>
                    Inscription
                  </button>
                </Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;