import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaBuilding, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaShareAlt
} from 'react-icons/fa';
import { fetchStageById , applyToStage} from '../../store/slices/stagesSlice';
import { addFavorite ,removeFavorite } from '../../store/slices/userSlice';

const StageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentStage, isLoading } = useSelector((state) => state.stages);
  const { isAuthenticated , user} = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.user);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    motivation: '',
  });
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const isFavorite = favorites.includes(parseInt(id));
  const isStudent = user?.userType === 'student';

  useEffect(() => {
    dispatch(fetchStageById(id));
  }, [dispatch, id]);

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFavorite(parseInt(id)));
    } else {
      dispatch(addFavorite(parseInt(id)));
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(applyToStage({ 
      stageId: id, 
      applicationData 
    }));
    
    if (result.type === 'stages/applyToStage/fulfilled') {
      setApplicationSuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplicationSuccess(false);
        setApplicationData({ coverLetter: '', motivation: '' });
      }, 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentStage?.title,
        text: `Découvrez cette offre de stage: ${currentStage?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier!');
    }
  };

  if (isLoading) {
    return (
      <Container className="stageDetailsPage">
        <div className="loadingSpinner">
          <div className="spinner-border text-primary spinner-border-custom" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!currentStage) {
    return (
      <Container className="stageDetailsPage">
        <Alert variant="danger">Stage non trouvé</Alert>
      </Container>
    );
  }

  return (
    <div className="stageDetailsPage">
      <Container>
        <Row>
          <Col lg={isStudent ? 8 : 12}>
            <Card className="detailsCard mb-4">
              <div className="detailsHeader">
                {currentStage.companyLogo && (
                  <img src={currentStage.companyLogo} alt={currentStage.company} className="companyLogo" />
                )}
                <h2 className="mb-3">{currentStage.title}</h2>
                <h4 className="mb-4">
                  <FaBuilding className="me-2" />
                  {currentStage.company}
                </h4>
                
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" />
                    <span>{currentStage.location}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaClock className="me-2" />
                    <span>{currentStage.duration}</span>
                  </div>
                  {currentStage.salary && (
                    <div className="d-flex align-items-center">
                      <FaMoneyBillWave className="me-2" />
                      <span>{currentStage.salary}</span>
                    </div>
                  )}
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="me-2" />
                    <span>Début: {currentStage.startDate}</span>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {currentStage.tags?.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="detailsBody">
                <div className="detailSection">
                  <h5>Description du stage</h5>
                  <p>{currentStage.fullDescription || currentStage.description}</p>
                </div>

                <div className="detailSection">
                  <h5>Missions principales</h5>
                  <ul className="requirementsList">
                    {currentStage.missions?.map((mission, index) => (
                      <li key={index}>{mission}</li>
                    )) || (
                      <>
                        <li>Participer aux projets de l'équipe</li>
                        <li>Contribuer au développement des produits</li>
                        <li>Collaborer avec les équipes techniques</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="detailSection">
                  <h5>Profil recherché</h5>
                  <ul className="requirementsList">
                    {currentStage.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    )) || (
                      <>
                        <li>Étudiant(e) en Master ou dernière année d'école</li>
                        <li>Motivé(e) et curieux(se)</li>
                        <li>Capacité à travailler en équipe</li>
                      </>
                    )}
                  </ul>
                </div>

                {currentStage.benefits && (
                  <div className="detailSection">
                    <h5>Avantages</h5>
                    <ul className="requirementsList">
                      {currentStage.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="detailSection">
                  <h5>À propos de l'entreprise</h5>
                  <p>{currentStage.companyDescription || 'Entreprise dynamique et innovante.'}</p>
                </div>
              </div>
            </Card>

            {/* Informations clés - Show for non-students in main column */}
            {!isStudent && (
              <Card className="mb-3">
                <Card.Body>
                  <h6 className="mb-3">Informations clés</h6>
                  <div className="mb-2">
                    <strong>Date de publication:</strong>
                    <div className="text-muted">
                      {new Date(currentStage.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Type de contrat:</strong>
                    <div className="text-muted">Stage conventionné</div>
                  </div>
                  <div className="mb-2">
                    <strong>Nombre de postes:</strong>
                    <div className="text-muted">{currentStage.positions || 1}</div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Sidebar - Only for Students */}
          {isStudent && (
            <Col lg={4}>
              <div className="applySection">
                <Button
                  variant="success"
                  size="lg"
                  className="w-100 mb-3"
                  onClick={handleApplyClick}
                >
                  Postuler maintenant
                </Button>

                <div className="d-flex gap-2 mb-4">
                  <Button
                    variant={isFavorite ? 'danger' : 'outline-danger'}
                    className="flex-fill"
                    onClick={handleFavoriteToggle}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    {isFavorite ? ' Retiré' : ' Sauvegarder'}
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="flex-fill"
                    onClick={handleShare}
                  >
                    <FaShareAlt /> Partager
                  </Button>
                </div>

                <Card className="mb-3">
                  <Card.Body>
                    <h6 className="mb-3">Informations clés</h6>
                    <div className="mb-2">
                      <strong>Date de publication:</strong>
                      <div className="text-muted">
                        {new Date(currentStage.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>Type de contrat:</strong>
                      <div className="text-muted">Stage conventionné</div>
                    </div>
                    <div className="mb-2">
                      <strong>Nombre de postes:</strong>
                      <div className="text-muted">{currentStage.positions || 1}</div>
                    </div>
                  </Card.Body>
                </Card>

                <Alert variant="info">
                  <strong>💡 Conseil:</strong> Personnalisez votre candidature pour maximiser vos chances!
                </Alert>
              </div>
            </Col>
          )}
        </Row>

        {/* Application Modal - Only for Students */}
        {isStudent && (
          <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Postuler à {currentStage.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {applicationSuccess ? (
                <Alert variant="success">
                  <h5>✅ Candidature envoyée avec succès!</h5>
                  <p>Nous avons bien reçu votre candidature. L'entreprise vous contactera si votre profil correspond.</p>
                </Alert>
              ) : (
                <Form onSubmit={handleApplicationSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Lettre de motivation *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce stage..."
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        coverLetter: e.target.value
                      })}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Motivation (optionnel)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Qu'est-ce qui vous attire dans cette entreprise?"
                      value={applicationData.motivation}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        motivation: e.target.value
                      })}
                    />
                  </Form.Group>

                  <Alert variant="warning">
                    <small>
                      Votre CV et vos informations de profil seront automatiquement joints à cette candidature.
                    </small>
                  </Alert>

                  <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                      Annuler
                    </Button>
                    <Button variant="success" type="submit" className="flex-fill">
                      Envoyer ma candidature
                    </Button>
                  </div>
                </Form>
              )}
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default StageDetails;