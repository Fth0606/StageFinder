import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { updateUserProfile } from '../../store/slices/userSlice';

const EditProfilAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.user);
  const [validationError, setValidationError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user, profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validation AVANT le dispatch
    if (formData.password && formData.confirmPassword) {

      if (formData.confirmPassword.length < 6) {
        setValidationError('Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }

    // Préparer les données à envoyer
    const dataToUpdate = {
      name: formData.name,
      email: formData.email,
    };

    // Ajouter le nouveau mot de passe seulement s'il est fourni
    if (formData.confirmPassword) {
      dataToUpdate.password = formData.confirmPassword;
    }

    const result = await dispatch(updateUserProfile(dataToUpdate));
    
    if (result.type === 'user/updateProfile/fulfilled') {
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/profile');
      }, 2000);
    } else {
      setValidationError('Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card style={{ border: 'none', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #0066CC, #00C853)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem'
            }}>
              <h3 className="mb-0">
                <FaUser className="me-2" />
                Modifier mon profil
              </h3>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success">
                  <strong>✅ Succès !</strong> Votre profil a été mis à jour avec succès.
                </Alert>
              )}

              {(error || validationError) && (
                <Alert variant="danger">
                  {validationError || error?.message || 'Une erreur est survenue'}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Informations personnelles */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>
                  <FaUser className="me-2" />
                  Informations personnelles
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom complet *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-3 mt-4" style={{ color: '#0066CC' }}>
                  Changer le mot de passe (optionnel)
                </h5>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mot de passe actuel</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{ borderRadius: '10px' }}
                      />
                      <Form.Text className="text-muted">
                        Laissez vide si vous ne voulez pas changer le mot de passe
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nouveau mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        minLength={6}
                        style={{ borderRadius: '10px' }}
                      />
                      <Form.Text className="text-muted">
                        Minimum 6 caractères
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* Boutons */}
                <div className="d-flex gap-2 justify-content-end">
                  <Button 
                    variant="outline-secondary"
                    onClick={() => navigate('/admin/profile')}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                  >
                    <FaTimes className="me-2" />
                    Annuler
                  </Button>
                  <Button 
                    variant="success"
                    type="submit"
                    disabled={isLoading}
                    style={{ 
                      backgroundColor: '#00C853',
                      borderColor: '#00C853',
                      borderRadius: '10px',
                      padding: '0.75rem 1.5rem'
                    }}
                  >
                    <FaSave className="me-2" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfilAdmin;