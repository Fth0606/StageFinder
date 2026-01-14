import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaBuilding } from 'react-icons/fa';
import './StageCard.module.css';

const StageCard = ({ stage }) => {
  return (
    <Card className="stage-card h-100" style={{ 
      border: 'none',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <Card.Header style={{
        background: 'linear-gradient(135deg, #0066CC 0%, #00C853 100%)',
        color: 'white',
        borderRadius: '15px 15px 0 0',
        padding: '1.25rem',
        border: 'none'
      }}>
        <h5 className="mb-0">{stage.title}</h5>
      </Card.Header>
      
      <Card.Body style={{ padding: '1.5rem' }}>
        <div className="d-flex align-items-center mb-2">
          <FaBuilding className="me-2 text-primary" />
          <strong>{stage.company}</strong>
        </div>
        
        <div className="d-flex align-items-center mb-2 text-muted">
          <FaMapMarkerAlt className="me-2" />
          <span>{stage.location}</span>
        </div>
        
        <div className="d-flex align-items-center mb-3 text-muted">
          <FaClock className="me-2" />
          <span>{stage.duration}</span>
        </div>
        
        <p className="card-text">{stage.description}</p>
        
        <div className="mb-3">
          {stage.tags?.map((tag, index) => (
            <Badge 
              key={index} 
              bg="primary" 
              className="me-2"
              style={{
                backgroundColor: '#0066CC',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem'
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <Link to={`/stages/${stage.id}`}>
          <button className="btn btn-primary w-100" style={{
            backgroundColor: '#0066CC',
            borderColor: '#0066CC',
            borderRadius: '10px',
            padding: '0.75rem',
            fontWeight: '600'
          }}>
            Voir les détails
          </button>
        </Link>
      </Card.Body>
      
      <Card.Footer className="text-muted small" style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        padding: '0.75rem 1.5rem'
      }}>
        Publié le {new Date(stage.createdAt).toLocaleDateString('fr-FR')}
      </Card.Footer>
    </Card>
  );
};

export default StageCard;