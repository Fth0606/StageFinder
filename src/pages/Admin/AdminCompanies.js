import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaCheck, FaTimes, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { fetchAllCompanies, verifyCompany, suspendCompany } from '../../store/slices/adminSlice';

const AdminCompanies = () => {
  const dispatch = useDispatch();
  const { companies, isLoading } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  const handleVerify = async (company) => {
    await dispatch(verifyCompany(company.id));
  };

  const handleSuspend = async (company) => {
    await dispatch(suspendCompany(company.id));
  };

  const getStatusBadge = (status) => {
    const variants = {
      verified: { bg: 'success', text: 'Vérifiée' },
      pending: { bg: 'warning', text: 'En attente' },
      suspended: { bg: 'danger', text: 'Suspendue' },
    };
    return variants[status] || variants.pending;
  };

  const filteredCompanies = companies?.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <Container fluid className="py-5">
      <div className="mb-4">
        <h2>Gestion des entreprises</h2>
        <p className="text-muted">Vérifiez et gérez les entreprises inscrites</p>
      </div>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#00C853', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{companies?.filter(c => c.status === 'verified').length || 0}</h3>
              <p className="mb-0">Entreprises vérifiées</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#FFA726', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{companies?.filter(c => c.status === 'pending').length || 0}</h3>
              <p className="mb-0">En attente de vérification</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#0066CC', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{companies?.length || 0}</h3>
              <p className="mb-0">Total entreprises</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Rechercher une entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '10px' }}
              />
            </Col>
            <Col md={6}>
              <div className="d-flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilterStatus('all')}
                  style={{ borderRadius: '10px' }}
                >
                  Toutes
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'warning' : 'outline-warning'}
                  onClick={() => setFilterStatus('pending')}
                  style={{ borderRadius: '10px' }}
                >
                  En attente
                </Button>
                <Button
                  variant={filterStatus === 'verified' ? 'success' : 'outline-success'}
                  onClick={() => setFilterStatus('verified')}
                  style={{ borderRadius: '10px' }}
                >
                  Vérifiées
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Companies Table */}
      <Card style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Localisation</th>
                  <th>Secteur</th>
                  <th>Inscription</th>
                  <th>Stages</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaBuilding size={30} className="me-3 text-primary" />
                        <div>
                          <strong>{company.name}</strong>
                          <br />
                          <small className="text-muted">{company.employeesCount} employés</small>
                        </div>
                      </div>
                    </td>
                    <td>{company.location}</td>
                    <td>
                      {company.sectors?.slice(0, 2).map((sector, index) => (
                        <Badge key={index} bg="secondary" className="me-1">
                          {sector}
                        </Badge>
                      ))}
                    </td>
                    <td>
                      <small>{new Date(company.createdAt).toLocaleDateString('fr-FR')}</small>
                    </td>
                    <td>
                      <Badge bg="info">
                        <FaBriefcase className="me-1" />
                        {company.stagesCount || 0}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(company.status).bg}>
                        {getStatusBadge(company.status).text}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowDetailModal(true);
                          }}
                          style={{ borderRadius: '8px' }}
                        >
                          <FaEye />
                        </Button>
                        {company.status === 'pending' && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleVerify(company)}
                            style={{ borderRadius: '8px' }}
                          >
                            <FaCheck />
                          </Button>
                        )}
                        {company.status === 'verified' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleSuspend(company)}
                            style={{ borderRadius: '8px' }}
                          >
                            <FaTimes />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompany && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>{selectedCompany.name}</h5>
                  <p className="text-muted">
                    <FaBuilding className="me-2" />
                    {selectedCompany.location}
                  </p>
                </Col>
                <Col md={6} className="text-end">
                  <Badge bg={getStatusBadge(selectedCompany.status).bg} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                    {getStatusBadge(selectedCompany.status).text}
                  </Badge>
                </Col>
              </Row>

              <h6>Description</h6>
              <p>{selectedCompany.description}</p>

              <h6>Secteurs d'activité</h6>
              <div className="mb-3">
                {selectedCompany.sectors?.map((sector, index) => (
                  <Badge key={index} bg="primary" className="me-2 mb-2" style={{ backgroundColor: '#0066CC' }}>
                    {sector}
                  </Badge>
                ))}
              </div>

              <Row>
                <Col md={6}>
                  <h6>Informations</h6>
                  <p>
                    <strong>Nombre d'employés:</strong> {selectedCompany.employeesCount}<br />
                    <strong>Site web:</strong> <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
                      {selectedCompany.website}
                    </a><br />
                    <strong>Email:</strong> {selectedCompany.email}<br />
                    <strong>Téléphone:</strong> {selectedCompany.phone}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Statistiques</h6>
                  <p>
                    <strong>Stages publiés:</strong> {selectedCompany.stagesCount || 0}<br />
                    <strong>Candidatures reçues:</strong> {selectedCompany.applicationsCount || 0}<br />
                    <strong>Inscrit le:</strong> {new Date(selectedCompany.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Fermer
          </Button>
          {selectedCompany?.status === 'pending' && (
            <Button 
              variant="success" 
              onClick={() => {
                handleVerify(selectedCompany);
                setShowDetailModal(false);
              }}
            >
              <FaCheck className="me-2" />
              Vérifier
            </Button>
          )}
          {selectedCompany?.status === 'verified' && (
            <Button 
              variant="danger" 
              onClick={() => {
                handleSuspend(selectedCompany);
                setShowDetailModal(false);
              }}
            >
              <FaTimes className="me-2" />
              Suspendre
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminCompanies;