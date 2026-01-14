import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaPaperPlane, FaUser, FaSearch } from 'react-icons/fa';
import { fetchCompanyMessages, sendMessage } from '../../store/slices/companySlice';

const CompanyMessages = () => {
  const dispatch = useDispatch();
  const { conversations, isLoading } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCompanyMessages());
  }, [dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversation) {
      await dispatch(sendMessage({
        conversationId: selectedConversation.id,
        message: messageText,
        sender: 'company',
      }));
      setMessageText('');
    }
  };

  const filteredConversations = conversations?.filter(conv =>
    conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Container fluid className="py-5">
      <Row>
        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: '15px', height: 'calc(100vh - 150px)' }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '15px 15px 0 0'
            }}>
              <h5 className="mb-3">Messages</h5>
              <Form.Control
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '10px' }}
              />
            </Card.Header>
            <Card.Body style={{ padding: 0, overflowY: 'auto' }}>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : filteredConversations.length > 0 ? (
                <ListGroup variant="flush">
                  {filteredConversations.map((conversation) => (
                    <ListGroup.Item
                      key={conversation.id}
                      action
                      active={selectedConversation?.id === conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      style={{
                        cursor: 'pointer',
                        borderLeft: selectedConversation?.id === conversation.id 
                          ? '4px solid #0066CC' 
                          : 'none'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0066CC, #00C853)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontWeight: 'bold'
                          }}>
                            {conversation.candidateName.charAt(0)}
                          </div>
                          <div>
                            <strong>{conversation.candidateName}</strong>
                            <br />
                            <small className="text-muted">
                              {conversation.lastMessage?.substring(0, 30)}...
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            {new Date(conversation.lastMessageAt).toLocaleDateString('fr-FR')}
                          </small>
                          {conversation.unreadCount > 0 && (
                            <Badge bg="danger" className="d-block mt-1">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Aucune conversation</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {selectedConversation ? (
            <Card style={{ border: 'none', borderRadius: '15px', height: 'calc(100vh - 150px)' }}>
              <Card.Header style={{
                background: 'white',
                borderBottom: '2px solid #e9ecef',
                borderRadius: '15px 15px 0 0',
                padding: '1.5rem'
              }}>
                <div className="d-flex align-items-center">
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0066CC, #00C853)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    {selectedConversation.candidateName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="mb-0">{selectedConversation.candidateName}</h5>
                    <small className="text-muted">
                      Candidat pour: {selectedConversation.stageTitle}
                    </small>
                  </div>
                </div>
              </Card.Header>

              <Card.Body style={{ 
                overflowY: 'auto', 
                backgroundColor: '#f8f9fa',
                flex: 1,
                padding: '1.5rem'
              }}>
                {selectedConversation.messages?.map((message, index) => (
                  <div
                    key={index}
                    className="mb-3"
                    style={{
                      display: 'flex',
                      justifyContent: message.sender === 'company' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '0.75rem 1rem',
                        borderRadius: '15px',
                        backgroundColor: message.sender === 'company' ? '#0066CC' : 'white',
                        color: message.sender === 'company' ? 'white' : '#333',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    >
                      <p className="mb-1">{message.text}</p>
                      <small style={{ opacity: 0.8 }}>
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                  </div>
                ))}
              </Card.Body>

              <Card.Footer style={{
                background: 'white',
                borderTop: '2px solid #e9ecef',
                padding: '1.5rem'
              }}>
                <Form onSubmit={handleSendMessage}>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Écrivez votre message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      style={{ borderRadius: '25px', padding: '0.75rem 1.5rem' }}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!messageText.trim()}
                      style={{
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#0066CC',
                        borderColor: '#0066CC'
                      }}
                    >
                      <FaPaperPlane />
                    </Button>
                  </div>
                </Form>
              </Card.Footer>
            </Card>
          ) : (
            <Card style={{ 
              border: 'none', 
              borderRadius: '15px', 
              height: 'calc(100vh - 150px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="text-center">
                <FaUser size={60} className="text-muted mb-3" />
                <h5 className="text-muted">Sélectionnez une conversation</h5>
                <p className="text-muted">
                  Choisissez une conversation dans la liste pour commencer à échanger
                </p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyMessages;