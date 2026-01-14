import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBriefcase, FaGraduationCap, FaFilePdf, FaUpload, FaDownload, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { fetchUserProfile, fetchUserApplications } from '../../store/slices/userSlice';
import './Profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, applications } = useSelector((state) => state.user);

  const [cvFile, setCvFile] = useState(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [cvError, setCvError] = useState('');

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserApplications());
    
    // Charger le CV depuis localStorage
    const savedCv = localStorage.getItem(`cv_${user?.id || user?.email}`);
    if (savedCv) {
      setCvFile(JSON.parse(savedCv));
    }
  }, [dispatch, user?.id, user?.email]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validation du fichier
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setCvError('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX.');
      return;
    }

    if (file.size > maxSize) {
      setCvError('Le fichier est trop volumineux (max 5MB).');
      return;
    }

    // Créer un objet avec les informations du fichier
    const reader = new FileReader();
    reader.onload = (event) => {
      const cvData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: event.target.result,
        uploadedAt: new Date().toISOString()
      };

      // Sauvegarder dans localStorage
      localStorage.setItem(`cv_${user?.id || user?.email}`, JSON.stringify(cvData));
      setCvFile(cvData);
      setUploadSuccess(true);
      setCvError('');
      
      setTimeout(() => {
        setUploadSuccess(false);
        setShowCvModal(false);
      }, 2000);
    };
    
    reader.readAsDataURL(file);
  };

  const handleDownloadCv = () => {
    if (!cvFile) return;

    const link = document.createElement('a');
    link.href = cvFile.data;
    link.download = cvFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteCv = () => {
    localStorage.removeItem(`cv_${user?.id || user?.email}`);
    setCvFile(null);
    setShowCvModal(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Container style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh',
      padding: '3rem 0' 
    }}>
      <Row>
        <Col lg={4} className="mb-4">
          {/* Profile Card */}
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
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
                background: 'linear-gradient(135deg, #0066CC, #00C853)',
                color: 'white',
                fontSize: '3rem',
                fontWeight: 'bold',
                border: '5px solid white',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={user?.name} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }} />
                ) : (
                  <div>{user?.name?.charAt(0)}</div>
                )}
              </div>
              <h3>{user?.name}</h3>
              <p className="text-muted">{user?.email}</p>
              <Badge bg="info" className="mb-3">
                {profile?.userType === 'student' ? 'Étudiant' : 
                 profile?.userType === 'company' ? 'Entreprise' : 'Admin'}
              </Badge>
              
              <Button 
                variant="primary" 
                className="w-100"
                onClick={handleEditProfile}
                style={{
                  backgroundColor: '#0066CC',
                  borderColor: '#0066CC',
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

          {/* CV Card */}
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #00C853, #00A844)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '1rem'
            }}>
              <h6 className="mb-0">
                <FaFilePdf className="me-2" />
                Mon CV
              </h6>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              {cvFile ? (
                <div>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    border: '2px solid #00C853'
                  }}>
                    <div className="d-flex align-items-center mb-2">
                      <FaFilePdf style={{ color: '#dc3545', fontSize: '2rem', marginRight: '1rem' }} />
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                          {cvFile.name}
                        </div>
                        <small className="text-muted">
                          {formatFileSize(cvFile.size)} • Ajouté le {new Date(cvFile.uploadedAt).toLocaleDateString('fr-FR')}
                        </small>
                      </div>
                      <FaCheckCircle style={{ color: '#00C853', fontSize: '1.5rem' }} />
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-success"
                      onClick={handleDownloadCv}
                      style={{ borderRadius: '10px' }}
                    >
                      <FaDownload className="me-2" />
                      Télécharger
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={() => setShowCvModal(true)}
                      style={{ borderRadius: '10px' }}
                    >
                      <FaUpload className="me-2" />
                      Remplacer
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={handleDeleteCv}
                      style={{ borderRadius: '10px' }}
                    >
                      <FaTrash className="me-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FaFilePdf style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
                  <p className="text-muted mb-3">Aucun CV ajouté</p>
                  <Button 
                    variant="success"
                    onClick={() => setShowCvModal(true)}
                    style={{
                      backgroundColor: '#00C853',
                      borderColor: '#00C853',
                      borderRadius: '10px',
                      padding: '0.75rem 1.5rem'
                    }}
                  >
                    <FaUpload className="me-2" />
                    Ajouter mon CV
                  </Button>
                  <small className="d-block mt-2 text-muted">
                    PDF, DOC ou DOCX (max 5MB)
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
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
              <h5 className="mb-0" style={{ color: '#0066CC' }}>
                <FaGraduationCap className="me-2" />
                À propos
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Row>
                <Col md={6} className="mb-3">
                  <strong>Formation :</strong>
                  <p className="text-muted">{profile?.education || 'Non renseigné'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Domaine :</strong>
                  <p className="text-muted">{profile?.field || 'Non renseigné'}</p>
                </Col>
                <Col md={12} className="mb-3">
                  <strong>Compétences :</strong>
                  <div className="mt-2">
                    {profile?.skills?.map((skill, index) => (
                      <Badge 
                        key={index} 
                        bg="primary" 
                        className="me-2 mb-2"
                        style={{
                          backgroundColor: '#0066CC',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.85rem'
                        }}
                      >
                        {skill}
                      </Badge>
                    )) || <p className="text-muted">Aucune compétence ajoutée</p>}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

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
              <h5 className="mb-0" style={{ color: '#0066CC' }}>
                <FaBriefcase className="me-2" />
                Mes Candidatures ({applications?.length || 0})
              </h5>
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              {applications && applications.length > 0 ? (
                applications.map((application) => (
                  <div 
                    key={application.id} 
                    className="mb-3 p-3"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>{application.stageTitle}</h6>
                        <p className="text-muted mb-1">{application.company}</p>
                        <small className="text-muted">
                          Postulé le {new Date(application.appliedAt).toLocaleDateString('fr-FR')}
                        </small>
                      </div>
                      <Badge
                        bg={
                          application.status === 'accepted'
                            ? 'success'
                            : application.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {application.status === 'pending' && 'En attente'}
                        {application.status === 'accepted' && 'Accepté'}
                        {application.status === 'rejected' && 'Refusé'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">Aucune candidature pour le moment</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CV Upload Modal */}
      <Modal show={showCvModal} onHide={() => setShowCvModal(false)} centered>
        <Modal.Header 
          closeButton
          style={{
            background: 'linear-gradient(135deg, #00C853, #00A844)',
            color: 'white'
          }}
        >
          <Modal.Title>
            <FaUpload className="me-2" />
            {cvFile ? 'Remplacer mon CV' : 'Ajouter mon CV'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {uploadSuccess ? (
            <Alert variant="success">
              <FaCheckCircle size={40} className="mb-3" />
              <h5>CV ajouté avec succès !</h5>
              <p>Votre CV est maintenant disponible dans votre profil.</p>
            </Alert>
          ) : (
            <>
              {cvError && (
                <Alert variant="danger" dismissible onClose={() => setCvError('')}>
                  {cvError}
                </Alert>
              )}
              
              <FaFilePdf style={{ fontSize: '4rem', color: '#00C853', marginBottom: '1rem' }} />
              <h5 className="mb-3">Sélectionnez votre CV</h5>
              <p className="text-muted mb-4">
                Formats acceptés : PDF, DOC, DOCX<br />
                Taille maximale : 5MB
              </p>
              
              <input
                type="file"
                id="cv-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="success"
                size="lg"
                onClick={() => document.getElementById('cv-upload').click()}
                style={{
                  backgroundColor: '#00C853',
                  borderColor: '#00C853',
                  borderRadius: '10px',
                  padding: '0.75rem 2rem'
                }}
              >
                <FaUpload className="me-2" />
                Choisir un fichier
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;