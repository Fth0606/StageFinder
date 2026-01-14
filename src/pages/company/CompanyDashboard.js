import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaBriefcase, FaUsers, FaEnvelope, FaPlus, FaEye, FaChartLine } from 'react-icons/fa';
import { fetchCompanyStages, fetchCompanyApplications } from '../../store/slices/companySlice';
import './CompanyDashboard.module.css';

const CompanyDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stages, applications, stats, isLoading } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanyStages());
    dispatch(fetchCompanyApplications());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      closed: 'secondary',
      draft: 'warning'
    };
    return variants[status] || 'primary';
  };

  return (
    <Container className="company-dashboard py-5">
      <div className="mb-4">
        <h2>Tableau de bord - {user?.name}</h2>
        <p className="text-muted">Gérez vos offres de stage et candidatures</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #0066CC, #0052A3)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.totalStages || stages.length}</h3>
                  <p className="mb-0">Offres actives</p>
                </div>
                <FaBriefcase size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #00C853, #00A844)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.totalApplications || applications.length}</h3>
                  <p className="mb-0">Candidatures</p>
                </div>
                <FaUsers size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #FFA726, #FB8C00)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.pendingApplications || 0}</h3>
                  <p className="mb-0">En attente</p>
                </div>
                <FaEnvelope size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
            color: 'white'
          }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats?.viewsThisMonth || 0}</h3>
                  <p className="mb-0">Vues ce mois</p>
                </div>
                <FaChartLine size={40} style={{ opacity: 0.5 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card style={{ border: 'none', borderRadius: '15px' }}>
            <Card.Body>
              <h5 className="mb-3">Actions rapides</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/company/post-stage">
                  <Button variant="primary" style={{
                    backgroundColor: '#0066CC',
                    borderColor: '#0066CC',
                    borderRadius: '10px'
                  }}>
                    <FaPlus className="me-2" />
                    Publier une offre
                  </Button>
                </Link>
                <Link to="/company/applications">
                  <Button variant="success" style={{
                    backgroundColor: '#00C853',
                    borderColor: '#00C853',
                    borderRadius: '10px'
                  }}>
                    <FaUsers className="me-2" />
                    Voir les candidatures
                  </Button>
                </Link>
                <Link to="/company/messages">
                  <Button variant="info" style={{
                    borderRadius: '10px'
                  }}>
                    <FaEnvelope className="me-2" />
                    Messages
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Stages */}
      <Row>
        <Col lg={8}>
          <Card style={{ border: 'none', borderRadius: '15px' }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '15px 15px 0 0'
            }}>
              <h5 className="mb-0">Mes offres de stage</h5>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : stages.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Statut</th>
                      <th>Candidatures</th>
                      <th>Publié le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.slice(0, 5).map((stage) => (
                      <tr key={stage.id}>
                        <td>
                          <strong>{stage.title}</strong>
                          <br />
                          <small className="text-muted">{stage.location}</small>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(stage.status)}>
                            {stage.status === 'active' ? 'Active' : 
                             stage.status === 'closed' ? 'Fermée' : 'Brouillon'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="info">{stage.applicationsCount || 0}</Badge>
                        </td>
                        <td>
                          <small>{new Date(stage.createdAt).toLocaleDateString('fr-FR')}</small>
                        </td>
                        <td>
                          <Link to={`/company/stages/${stage.id}`}>
                            <Button variant="outline-primary" size="sm">
                              <FaEye className="me-1" />
                              Voir
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Aucune offre publiée</p>
                  <Link to="/company/post-stage">
                    <Button variant="primary">Créer une offre</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Applications */}
        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: '15px' }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '15px 15px 0 0'
            }}>
              <h5 className="mb-0">Candidatures récentes</h5>
            </Card.Header>
            <Card.Body>
              {applications.slice(0, 5).map((app) => (
                <div 
                  key={app.id} 
                  className="application-item mb-3 p-3"
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{app.candidateName}</strong>
                      <br />
                      <small className="text-muted">{app.stageTitle}</small>
                      <br />
                      <small className="text-muted">
                        {new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                      </small>
                    </div>
                    <Badge bg="warning" text="dark">Nouveau</Badge>
                  </div>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-muted text-center">Aucune candidature</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyDashboard;

