import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaCheck, FaTimes, FaEnvelope, FaDownload, FaFilter } from 'react-icons/fa';
import { fetchCompanyApplications, updateApplicationStatus } from '../../store/slices/companySlice';

const CompanyApplications = () => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.company);
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchCompanyApplications());
  }, [dispatch]);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleAccept = async (application) => {
    await dispatch(updateApplicationStatus({
      applicationId: application.id,
      status: 'accepted',
    }));
    setShowDetailModal(false);
  };

  const handleReject = async () => {
    if (selectedApplication) {
      await dispatch(updateApplicationStatus({
        applicationId: selectedApplication.id,
        status: 'rejected',
        reason: rejectReason,
      }));
      setShowRejectModal(false);
      setShowDetailModal(false);
      setRejectReason('');
    }
  };

  const openRejectModal = (application) => {
    setSelectedApplication(application);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { bg: 'warning', text: 'En attente' },
      accepted: { bg: 'success', text: 'Acceptée' },
      rejected: { bg: 'danger', text: 'Refusée' },
      withdrawn: { bg: 'secondary', text: 'Retirée' },
    };
    return variants[status] || variants.pending;
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2>Candidatures reçues</h2>
        <p className="text-muted">Gérez les candidatures à vos offres de stage</p>
      </div>

      {/* Filters */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('all')}
              style={{ borderRadius: '10px' }}
            >
              Toutes ({statusCounts.all})
            </Button>
            <Button
              variant={filter === 'pending' ? 'warning' : 'outline-warning'}
              onClick={() => setFilter('pending')}
              style={{ borderRadius: '10px' }}
            >
              En attente ({statusCounts.pending})
            </Button>
            <Button
              variant={filter === 'accepted' ? 'success' : 'outline-success'}
              onClick={() => setFilter('accepted')}
              style={{ borderRadius: '10px' }}
            >
              Acceptées ({statusCounts.accepted})
            </Button>
            <Button
              variant={filter === 'rejected' ? 'danger' : 'outline-danger'}
              onClick={() => setFilter('rejected')}
              style={{ borderRadius: '10px' }}
            >
              Refusées ({statusCounts.rejected})
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Applications Table */}
      <Card style={{ border: 'none', borderRadius: '15px' }}>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : filteredApplications.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Candidat</th>
                  <th>Offre</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div>
                        <strong>{application.candidateName}</strong>
                        <br />
                        <small className="text-muted">{application.candidateEmail}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{application.stageTitle}</strong>
                        <br />
                        <small className="text-muted">{application.stageLocation}</small>
                      </div>
                    </td>
                    <td>
                      <small>{new Date(application.appliedAt).toLocaleDateString('fr-FR')}</small>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(application.status).bg}>
                        {getStatusBadge(application.status).text}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                          style={{ borderRadius: '8px' }}
                        >
                          <FaEye />
                        </Button>
                        {application.status === 'pending' && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleAccept(application)}
                              style={{ borderRadius: '8px' }}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => openRejectModal(application)}
                              style={{ borderRadius: '8px' }}
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Aucune candidature pour le moment</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la candidature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Candidat</h6>
                  <p>
                    <strong>{selectedApplication.candidateName}</strong><br />
                    {selectedApplication.candidateEmail}<br />
                    {selectedApplication.candidatePhone}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Offre</h6>
                  <p>
                    <strong>{selectedApplication.stageTitle}</strong><br />
                    {selectedApplication.stageLocation}
                  </p>
                </Col>
              </Row>

              <h6>Formation</h6>
              <p>{selectedApplication.candidateEducation || 'Non renseigné'}</p>

              <h6>Compétences</h6>
              <div className="mb-3">
                {selectedApplication.candidateSkills?.map((skill, index) => (
                  <Badge key={index} bg="primary" className="me-2 mb-2" style={{ backgroundColor: '#0066CC' }}>
                    {skill}
                  </Badge>
                ))}
              </div>

              <h6>Lettre de motivation</h6>
              <Card style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
                <Card.Body>
                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedApplication.coverLetter || 'Aucune lettre de motivation'}
                  </p>
                </Card.Body>
              </Card>

              {selectedApplication.cv && (
                <div className="mt-3">
                  <Button variant="outline-primary" style={{ borderRadius: '10px' }}>
                    <FaDownload className="me-2" />
                    Télécharger le CV
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Fermer
          </Button>
          {selectedApplication?.status === 'pending' && (
            <>
              <Button 
                variant="danger" 
                onClick={() => {
                  setShowDetailModal(false);
                  openRejectModal(selectedApplication);
                }}
              >
                <FaTimes className="me-2" />
                Refuser
              </Button>
              <Button 
                variant="success" 
                onClick={() => handleAccept(selectedApplication)}
                style={{ backgroundColor: '#00C853', borderColor: '#00C853' }}
              >
                <FaCheck className="me-2" />
                Accepter
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Refuser la candidature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Raison du refus (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Expliquez brièvement les raisons du refus..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Confirmer le refus
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CompanyApplications;