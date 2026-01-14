import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave, FaEye, FaPlus, FaTimes } from 'react-icons/fa';
import { createStage } from '../../store/slices/companySlice';

const PostStage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    salary: '',
    startDate: '',
    description: '',
    fullDescription: '',
    missions: [''],
    requirements: [''],
    benefits: [''],
    tags: [],
    status: 'draft',
    positions: 1,
  });

  const [currentTag, setCurrentTag] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e, status = 'draft') => {
    e.preventDefault();
    const stageData = {
      ...formData,
      status,
      company: user.name,
      companyId: user.id,
      missions: formData.missions.filter(m => m.trim() !== ''),
      requirements: formData.requirements.filter(r => r.trim() !== ''),
      benefits: formData.benefits.filter(b => b.trim() !== ''),
    };

    const result = await dispatch(createStage(stageData));
    if (result.type === 'company/createStage/fulfilled') {
      setSuccess(true);
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 2000);
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
              <h3 className="mb-0">Publier une offre de stage</h3>
              <p className="mb-0 mt-2">Créez votre offre de stage en quelques minutes</p>
            </Card.Header>

            <Card.Body className="p-4">
              {success && (
                <Alert variant="success">
                  <strong>Succès !</strong> Votre offre a été créée avec succès.
                </Alert>
              )}

              {error && (
                <Alert variant="danger">
                  <strong>Erreur !</strong> {error.message}
                </Alert>
              )}

              <Form onSubmit={(e) => handleSubmit(e, 'active')}>
                {/* Informations de base */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Informations de base</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Titre du poste *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Stage Développeur Full Stack"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Localisation *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Paris, France"
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Durée *</Form.Label>
                      <Form.Control
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="6 mois"
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rémunération</Form.Label>
                      <Form.Control
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="1000€/mois"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date de début</Form.Label>
                      <Form.Control
                        type="text"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        placeholder="Mars 2024"
                        style={{ borderRadius: '10px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre de postes</Form.Label>
                  <Form.Control
                    type="number"
                    name="positions"
                    value={formData.positions}
                    onChange={handleChange}
                    min="1"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <hr className="my-4" />

                {/* Description */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Description</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Description courte *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Résumé de l'offre (150 caractères max)"
                    required
                    maxLength={150}
                    style={{ borderRadius: '10px' }}
                  />
                  <Form.Text className="text-muted">
                    {formData.description.length}/150 caractères
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description complète *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    placeholder="Description détaillée du stage, contexte, équipe..."
                    required
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>

                <hr className="my-4" />

                {/* Missions */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Missions principales</h5>
                {formData.missions.map((mission, index) => (
                  <div key={index} className="mb-2">
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={mission}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'missions')}
                        placeholder="Décrivez une mission..."
                        style={{ borderRadius: '10px' }}
                      />
                      {formData.missions.length > 1 && (
                        <Button 
                          variant="outline-danger" 
                          onClick={() => removeArrayItem(index, 'missions')}
                          style={{ borderRadius: '10px' }}
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline-primary" 
                  onClick={() => addArrayItem('missions')}
                  className="mb-3"
                  style={{ borderRadius: '10px' }}
                >
                  <FaPlus className="me-2" />
                  Ajouter une mission
                </Button>

                <hr className="my-4" />

                {/* Profil recherché */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Profil recherché</h5>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="mb-2">
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                        placeholder="Compétence ou qualification requise..."
                        style={{ borderRadius: '10px' }}
                      />
                      {formData.requirements.length > 1 && (
                        <Button 
                          variant="outline-danger" 
                          onClick={() => removeArrayItem(index, 'requirements')}
                          style={{ borderRadius: '10px' }}
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline-primary" 
                  onClick={() => addArrayItem('requirements')}
                  className="mb-3"
                  style={{ borderRadius: '10px' }}
                >
                  <FaPlus className="me-2" />
                  Ajouter un critère
                </Button>

                <hr className="my-4" />

                {/* Avantages */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Avantages</h5>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="mb-2">
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={benefit}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'benefits')}
                        placeholder="Un avantage offert..."
                        style={{ borderRadius: '10px' }}
                      />
                      {formData.benefits.length > 1 && (
                        <Button 
                          variant="outline-danger" 
                          onClick={() => removeArrayItem(index, 'benefits')}
                          style={{ borderRadius: '10px' }}
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline-primary" 
                  onClick={() => addArrayItem('benefits')}
                  className="mb-3"
                  style={{ borderRadius: '10px' }}
                >
                  <FaPlus className="me-2" />
                  Ajouter un avantage
                </Button>

                <hr className="my-4" />

                {/* Tags */}
                <h5 className="mb-3" style={{ color: '#0066CC' }}>Compétences / Tags</h5>
                <div className="mb-3">
                  <div className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Ex: React, Python, Marketing..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      style={{ borderRadius: '10px' }}
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={addTag}
                      style={{ borderRadius: '10px' }}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        bg="primary" 
                        style={{
                          backgroundColor: '#0066CC',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => removeTag(tag)}
                      >
                        {tag} <FaTimes className="ms-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <hr className="my-4" />

                {/* Buttons */}
                <div className="d-flex gap-2 justify-content-end">
                  <Button 
                    variant="outline-secondary"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={isLoading}
                    style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                  >
                    <FaSave className="me-2" />
                    Enregistrer brouillon
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
                    <FaEye className="me-2" />
                    {isLoading ? 'Publication...' : 'Publier l\'offre'}
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

export default PostStage;