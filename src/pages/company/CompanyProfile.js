import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBuilding, FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { fetchCompanyStages } from '../../store/slices/companySlice';

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stages } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanyStages());
  }, [dispatch]);

  return (
    <Container className="py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
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
                background: 'linear-gradient(135deg, #00C853, #00A844)',
                color: 'white',
                fontSize: '4rem',
                fontWeight: 'bold',
                border: '5px solid white',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
              }}>
                <FaBuilding />
              </div>
              <h3>{user?.name || 'Mon Entreprise'}</h3>
              <p className="text-muted">{user?.email}</p>
              <Badge bg="success" className="mb-3">
                <FaBuilding className="me-1" />
                Entreprise
              </Badge>
              
              <Button 
                variant="success" 
                className="w-100 mb-2"
                onClick={() => navigate('/company/edit-profile')}
                style={{
                  backgroundColor: '#00C853',
                  borderColor: '#00C853',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontWeight: '600'
                }}
              >
                <FaEdit className="me-2" />
                Modifier le profil
              </Button>

              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => navigate('/company/dashboard')}
                style={{
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontWeight: '600'
                }}
              >
                Voir le tableau de bord
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Informations Entreprise */}
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
              <h5 className="mb-0" style={{ color: '#00C853' }}>
                <FaBuilding className="me-2" />
                Informations de l'entreprise
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Row>
                <Col md={6} className="mb-3">
                  <strong><FaMapMarkerAlt className="me-2 text-success" />Localisation :</strong>
                  <p className="text-muted">Paris, France</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong><FaPhone className="me-2 text-success" />Téléphone :</strong>
                  <p className="text-muted">01 23 45 67 89</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong><FaEnvelope className="me-2 text-success" />Email :</strong>
                  <p className="text-muted">{user?.email}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong><FaGlobe className="me-2 text-success" />Site web :</strong>
                  <p className="text-muted">www.entreprise.com</p>
                </Col>
                <Col md={12} className="mb-3">
                  <strong>Secteur d'activité :</strong>
                  <div className="mt-2">
                    <Badge bg="success" className="me-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Technologie
                    </Badge>
                    <Badge bg="success" className="me-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Innovation
                    </Badge>
                    <Badge bg="success" className="me-2" style={{ padding: '0.5rem 0.75rem' }}>
                      Digital
                    </Badge>
                  </div>
                </Col>
                <Col md={12}>
                  <strong>Description :</strong>
                  <p className="text-muted mt-2">
                    Nous sommes une entreprise innovante spécialisée dans les solutions technologiques.
                    Notre mission est d'accompagner les entreprises dans leur transformation digitale.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Statistiques */}
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
              <h5 className="mb-0" style={{ color: '#00C853' }}>
                <FaBriefcase className="me-2" />
                Statistiques
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Row className="text-center">
                <Col md={4}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #00C853, #00A844)',
                    color: 'white',
                    borderRadius: '15px',
                    marginBottom: '1rem'
                  }}>
                    <h2>{stages.length}</h2>
                    <p className="mb-0">Offres publiées</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #0066CC, #0052A3)',
                    color: 'white',
                    borderRadius: '15px',
                    marginBottom: '1rem'
                  }}>
                    <h2>45</h2>
                    <p className="mb-0">Candidatures</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #FFA726, #FB8C00)',
                    color: 'white',
                    borderRadius: '15px',
                    marginBottom: '1rem'
                  }}>
                    <h2>12</h2>
                    <p className="mb-0">En attente</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Mes offres récentes */}
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
              <h5 className="mb-0" style={{ color: '#00C853' }}>
                Mes offres récentes
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              {stages.length > 0 ? (
                stages.slice(0, 3).map((stage) => (
                  <div 
                    key={stage.id} 
                    className="mb-3 p-3"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate(`/company/stages/${stage.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#00C853';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>{stage.title}</h6>
                        <p className="text-muted mb-1">{stage.location}</p>
                        <small className="text-muted">
                          Publié le {new Date(stage.createdAt).toLocaleDateString('fr-FR')}
                        </small>
                      </div>
                      <Badge bg={stage.status === 'active' ? 'success' : 'secondary'}>
                        {stage.status === 'active' ? 'Active' : 'Fermée'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">Aucune offre publiée</p>
              )}
              
              <Button 
                variant="outline-success" 
                className="w-100 mt-3"
                onClick={() => navigate('/company/post-stage')}
                style={{ borderRadius: '10px', padding: '0.75rem' }}
              >
                Publier une nouvelle offre
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyProfile;
