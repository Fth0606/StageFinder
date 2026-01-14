import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { FaUser, FaCog, FaSignOutAlt, FaBuilding, FaUserShield } from 'react-icons/fa';
import './ProfileButton.module.css';

const ProfileButton = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fonction pour naviguer vers le bon profil selon le rôle
  const handleProfileClick = (e) => {
    e.preventDefault();
    
    if (user?.userType === 'admin') {
      navigate('/admin/profile');
    } else if (user?.userType === 'company') {
      navigate('/company/profile');
    } else {
      navigate('/profile');
    }
  };

  // Icône selon le type d'utilisateur
  const getProfileIcon = () => {
    if (user?.userType === 'admin') return <FaUserShield />;
    if (user?.userType === 'company') return <FaBuilding />;
    return <FaUser />;
  };

  return (
    <Dropdown align="end" className="ms-3">
      <Dropdown.Toggle 
        variant="link" 
        className="profile-dropdown-toggle p-0"
        style={{ 
          background: 'none', 
          border: 'none',
          boxShadow: 'none'
        }}
      >
        <div className="profile-avatar" style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: user?.userType === 'admin' 
            ? 'linear-gradient(135deg, #9C27B0, #7B1FA2)'
            : user?.userType === 'company'
            ? 'linear-gradient(135deg, #00C853, #00A844)'
            : 'linear-gradient(135deg, #0066CC, #00C853)',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '50%'
            }} />
          ) : (
            getProfileIcon()
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{
        minWidth: '280px',
        border: 'none',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        marginTop: '12px',
        padding: '0.5rem 0'
      }}>
        <Dropdown.Header>
          <strong>{user?.name || 'Utilisateur'}</strong>
          <div className="text-muted small">{user?.email}</div>
          {user?.userType && (
            <div className="mt-1">
              <span className={`badge ${
                user.userType === 'admin' ? 'bg-danger' :
                user.userType === 'company' ? 'bg-success' : 'bg-primary'
              }`}>
                {user.userType === 'admin' ? 'Administrateur' :
                 user.userType === 'company' ? 'Entreprise' : 'Étudiant'}
              </span>
            </div>
          )}
        </Dropdown.Header>
        
        <Dropdown.Divider />
        
        <Dropdown.Item onClick={handleProfileClick}>
          {getProfileIcon()} <span className="ms-2">Mon Profil</span>
        </Dropdown.Item>
        
        <Dropdown.Item as={Link} to="/settings">
          <FaCog className="me-2" />
          Paramètres
        </Dropdown.Item>
        
        <Dropdown.Divider />
        
        <Dropdown.Item onClick={onLogout} className="text-danger">
          <FaSignOutAlt className="me-2" />
          Déconnexion
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileButton;