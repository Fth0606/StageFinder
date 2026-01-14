import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaCheck, FaTimes, FaTrash, FaSearch } from 'react-icons/fa';
import { fetchAllStages, updateStageStatus, deleteStage } from '../../store/slices/adminSlice';

const AdminStages = () => {
  const dispatch = useDispatch();
  const { stages, isLoading } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStage, setSelectedStage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAllStages());
  }, [dispatch]);

  const handleApprove = async (stage) => {
    await dispatch(updateStageStatus({
      stageId: stage.id,
      status: 'approved',
    }));
  };

  const handleReject = async (stage) => {
    await dispatch(updateStageStatus({
      stageId: stage.id,
      status: 'rejected',
    }));
  };

  const handleDelete = async () => {
    if (selectedStage) {
      await dispatch(deleteStage(selectedStage.id));
      setShowDeleteModal(false);
      setSelectedStage(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { bg: 'success', text: 'Active' },
      pending: { bg: 'warning', text: 'En attente' },
      rejected: { bg: 'danger', text: 'Rejetée' },
      closed: { bg: 'secondary', text: 'Fermée' },
      draft: { bg: 'info', text: 'Brouillon' },
    };
    return variants[status] || variants.pending;
  };

  const filteredStages = stages?.filter(stage => {
    const matchesSearch = stage.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stage.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || stage.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <Container fluid className="py-5">
      <div className="mb-4">
        <h2>Gestion des offres de stage</h2>
        <p className="text-muted">Modérez et gérez toutes les offres de stage</p>
      </div>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#0066CC', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{stages?.filter(s => s.status === 'active').length || 0}</h3>
              <p className="mb-0">Stages actifs</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#FFA726', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{stages?.filter(s => s.status === 'pending').length || 0}</h3>
              <p className="mb-0">En attente</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#00C853', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{stages?.length || 0}</h3>
              <p className="mb-0">Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ border: 'none', borderRadius: '15px', background: '#EF5350', color: 'white' }}>
            <Card.Body className="text-center">
              <h3>{stages?.filter(s => s.status === 'rejected').length || 0}</h3>
              <p className="mb-0">Rejetées</p>
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
                placeholder="Rechercher par titre ou entreprise..."
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
                  Tous
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'warning' : 'outline-warning'}
                  onClick={() => setFilterStatus('pending')}
                  style={{ borderRadius: '10px' }}
                >
                  En attente
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'success' : 'outline-success'}
                  onClick={() => setFilterStatus('active')}
                  style={{ borderRadius: '10px' }}
                >
                  Actifs
                </Button>
                <Button
                  variant={filterStatus === 'rejected' ? 'danger' : 'outline-danger'}
                  onClick={() => setFilterStatus('rejected')}
                  style={{ borderRadius: '10px' }}
                >
                  Rejetés
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stages Table */}
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
                  <th>Titre</th>
                  <th>Entreprise</th>
                  <th>Localisation</th>
                  <th>Publié le</th>
                  <th>Candidatures</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStages.map((stage) => (
                  <tr key={stage.id}>
                    <td>
                      <strong>{stage.title}</strong>
                      <br />
                      <small className="text-muted">{stage.duration}</small>
                    </td>
                    <td>{stage.company}</td>
                    <td>{stage.location}</td>
                    <td>
                      <small>{new Date(stage.createdAt).toLocaleDateString('fr-FR')}</small>
                    </td>
                    <td>
                      <Badge bg="info">{stage.applicationsCount || 0}</Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(stage.status).bg}>
                        {getStatusBadge(stage.status).text}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedStage(stage);
                            setShowDetailModal(true);
                          }}
                          style={{ borderRadius: '8px' }}
                        >
                          <FaEye />
                        </Button>
                        {stage.status === 'pending' && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleApprove(stage)}
                              style={{ borderRadius: '8px' }}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleReject(stage)}
                              style={{ borderRadius: '8px' }}
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setSelectedStage(stage);
                            setShowDeleteModal(true);
                          }}
                          style={{ borderRadius: '8px' }}
                        >
                          <FaTrash />
                        </Button>
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
          <Modal.Title>Détails du stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStage && (
            <div>
              <h4>{selectedStage.title}</h4>
              <p className="text-muted">
                <strong>Entreprise:</strong> {selectedStage.company}<br />
                <strong>Localisation:</strong> {selectedStage.location}<br />
                <strong>Durée:</strong> {selectedStage.duration}<br />
                <strong>Rémunération:</strong> {selectedStage.salary || 'Non spécifié'}
              </p>

              <h6>Description</h6>
              <p>{selectedStage.description}</p>

              <h6>Tags</h6>
              <div className="mb-3">
                {selectedStage.tags?.map((tag, index) => (
                  <Badge key={index} bg="primary" className="me-2" style={{ backgroundColor: '#0066CC' }}>
                    {tag}
                  </Badge>
                ))}
              </div>

              <h6>Statut actuel</h6>
              <Badge bg={getStatusBadge(selectedStage.status).bg} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                {getStatusBadge(selectedStage.status).text}
              </Badge>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Fermer
          </Button>
          {selectedStage?.status === 'pending' && (
            <>
              <Button 
                variant="danger" 
                onClick={() => {
                  handleReject(selectedStage);
                  setShowDetailModal(false);
                }}
              >
                Rejeter
              </Button>
              <Button 
                variant="success" 
                onClick={() => {
                  handleApprove(selectedStage);
                  setShowDetailModal(false);
                }}
              >
                Approuver
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer l'offre <strong>{selectedStage?.title}</strong> ?
          Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminStages;