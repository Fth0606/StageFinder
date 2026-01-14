import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { fetchUserProfile, fetchUserApplications } from '../../store/slices/userSlice';
import './Profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { profile, applications } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserApplications());
  }, [dispatch]);

  // ✅ Fonction pour naviguer vers la page d'édition
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <Container style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh',
      padding: '3rem 0' 
    }}>
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
              
              {/* ✅ BOUTON MODIFIER QUI FONCTIONNE */}
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
    </Container>
  );
};

export default Profile;