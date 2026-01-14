import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaUserShield, FaUsers, FaBriefcase, FaBuilding, FaChartLine, FaUserPlus } from 'react-icons/fa';
import AddAdmin from './addAdmin';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.admin);
  
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleEditProfile = () => {
    navigate('/admin/edit-profil-admin');
  };

  const handleAddAdmin = (newAdmin) => {
    setSuccessMessage(`L'administrateur ${newAdmin.name} a été ajouté avec succès !`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <Container className="py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')} className="mb-4">
          <strong>✅ {successMessage}</strong>
        </Alert>
      )}

      <Row>
        <Col lg={4} className="mb-4">
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Card.Body className="text-center">
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                color: 'white',
                fontSize: '4rem',
                fontWeight: 'bold',
                border: '5px solid white',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
              }}>
                <FaUserShield />
              </div>
              <h3>{user?.name || 'Administrateur'}</h3>
              <p className="text-muted">{user?.email}</p>
              <Badge bg="danger" className="mb-3" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <FaUserShield className="me-1" />
                Administrateur
              </Badge>
              
              <Button 
                variant="danger" 
                className="w-100 mb-2"
                onClick={handleEditProfile}
                style={{
                  backgroundColor: '#da2736f3',
                  borderColor: '#cc0000',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontWeight: '600'
                }}
              >
                <FaEdit className="me-2" />
                Modifier le profil
              </Button>
            </Card.Body>
          </Card>

          {/* Accès rapides */}
          <Card className="mt-4" style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '20px 20px 0 0',
              padding: '1rem'
            }}>
              <h6 className="mb-0">Accès rapides</h6>
            </Card.Header>
            <Card.Body style={{ padding: '1rem' }}>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/admin/users')}
                  style={{ borderRadius: '8px', textAlign: 'left' }}
                >
                  <FaUsers className="me-2" />
                  Gérer les utilisateurs
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={() => navigate('/admin/stages')}
                  style={{ borderRadius: '8px', textAlign: 'left' }}
                >
                  <FaBriefcase className="me-2" />
                  Gérer les stages
                </Button>
                <Button 
                  variant="outline-warning" 
                  onClick={() => navigate('/admin/companies')}
                  style={{ borderRadius: '8px', textAlign: 'left' }}
                >
                  <FaBuilding className="me-2" />
                  Gérer les entreprises
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowAddAdminModal(true)}
                  style={{ borderRadius: '8px', textAlign: 'left' }}
                >
                  <FaUserPlus className="me-2" />
                  Ajouter un administrateur
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Vue d'ensemble */}
          <Card className="mb-4" style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem'
            }}>
              <h5 className="mb-0" style={{ color: '#9C27B0' }}>
                <FaChartLine className="me-2" />
                Vue d'ensemble de la plateforme
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Row>
                <Col md={3} className="mb-3">
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #0066CC, #0052A3)',
                    color: 'white',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <FaUsers size={30} className="mb-2" />
                    <h3>{stats?.totalUsers || 150}</h3>
                    <p className="mb-0">Utilisateurs</p>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #00C853, #00A844)',
                    color: 'white',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <FaBriefcase size={30} className="mb-2" />
                    <h3>{stats?.totalStages || 95}</h3>
                    <p className="mb-0">Stages</p>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #FFA726, #FB8C00)',
                    color: 'white',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <FaBuilding size={30} className="mb-2" />
                    <h3>{stats?.totalCompanies || 35}</h3>
                    <p className="mb-0">Entreprises</p>
                  </div>
                </Col>
                <Col md={3} className="mb-3">
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                    color: 'white',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <FaChartLine size={30} className="mb-2" />
                    <h3>{stats?.totalApplications || 412}</h3>
                    <p className="mb-0">Candidatures</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Informations du compte */}
          <Card className="mb-4" style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem'
            }}>
              <h5 className="mb-0" style={{ color: '#9C27B0' }}>
                Informations du compte administrateur
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Nom :</strong>
                  <p className="text-muted">{user?.name || 'Administrateur'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Email :</strong>
                  <p className="text-muted">{user?.email}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Rôle :</strong>
                  <p className="text-muted">Super Administrateur</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Statut :</strong>
                  <Badge bg="success" style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}>
                    Actif
                  </Badge>
                </Col>
                <Col md={12}>
                  <strong>Permissions :</strong>
                  <div className="mt-2">
                    <Badge bg="primary" className="me-2 mb-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Gestion utilisateurs
                    </Badge>
                    <Badge bg="primary" className="me-2 mb-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Gestion stages
                    </Badge>
                    <Badge bg="primary" className="me-2 mb-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Gestion entreprises
                    </Badge>
                    <Badge bg="primary" className="me-2 mb-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Accès statistiques
                    </Badge>
                    <Badge bg="primary" className="me-2 mb-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Modération contenu
                    </Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Actions récentes */}
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem'
            }}>
              <h5 className="mb-0" style={{ color: '#9C27B0' }}>
                Vos actions récentes
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #e9ecef' }}>
                <div className="d-flex align-items-start">
                  <div className="me-3" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#0066CC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FaUsers />
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">Validation de 3 nouveaux utilisateurs</p>
                    <small className="text-muted">Il y a 2 heures</small>
                  </div>
                </div>
              </div>
              
              <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #e9ecef' }}>
                <div className="d-flex align-items-start">
                  <div className="me-3" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#00C853',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FaBriefcase />
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">Approbation de 5 offres de stage</p>
                    <small className="text-muted">Il y a 5 heures</small>
                  </div>
                </div>
              </div>
              
              <div className="mb-0">
                <div className="d-flex align-items-start">
                  <div className="me-3" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#FFA726',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FaBuilding />
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">Vérification de 2 entreprises</p>
                    <small className="text-muted">Hier à 15:30</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

            {/* Modal pour ajouter un admin */}
      <AddAdmin
        show={showAddAdminModal}
        handleClose={() => setShowAddAdminModal(false)}
        onAddAdmin={handleAddAdmin}
      />
    </Container>
  );
};

export default AdminProfile;