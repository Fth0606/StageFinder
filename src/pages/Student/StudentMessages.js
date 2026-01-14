import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaPaperPlane, FaBuilding, FaSearch } from 'react-icons/fa';
import { fetchStudentMessages, sendMessageToCompany, startConversation } from '../../store/slices/messagesSlice';

const StudentMessages = () => {
  const dispatch = useDispatch();
  const { conversations, isLoading } = useSelector((state) => state.messages);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchStudentMessages());
  }, [dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversation) {
      await dispatch(sendMessageToCompany({
        conversationId: selectedConversation.id,
        message: messageText,
        sender: 'student',
      }));
      setMessageText('');
    }
  };

  const filteredConversations = conversations?.filter(conv =>
    conv.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.stageTitle.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Container fluid className="py-5">
      <div className="mb-4">
        <h2>Mes Messages</h2>
        <p className="text-muted">Communiquez avec les entreprises</p>
      </div>

      <Row>
        <Col lg={4}>
          <Card style={{ border: 'none', borderRadius: '15px', height: 'calc(100vh - 200px)' }}>
            <Card.Header style={{
              background: 'white',
              borderBottom: '2px solid #e9ecef',
              borderRadius: '15px 15px 0 0'
            }}>
              <h5 className="mb-3">Conversations</h5>
              <Form.Control
                type="text"
                placeholder="Rechercher..."
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
                            marginRight: '12px'
                          }}>
                            <FaBuilding />
                          </div>
                          <div>
                            <strong>{conversation.companyName}</strong>
                            <br />
                            <small className="text-muted">{conversation.stageTitle}</small>
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
                  <FaBuilding size={50} className="text-muted mb-3" />
                  <p className="text-muted">Aucune conversation</p>
                  <small className="text-muted">
                    Postulez à des offres pour commencer à discuter avec les entreprises
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {selectedConversation ? (
            <Card style={{ border: 'none', borderRadius: '15px', height: 'calc(100vh - 200px)' }}>
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
                    fontSize: '1.5rem'
                  }}>
                    <FaBuilding />
                  </div>
                  <div>
                    <h5 className="mb-0">{selectedConversation.companyName}</h5>
                    <small className="text-muted">
                      Conversation à propos de: {selectedConversation.stageTitle}
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
                      justifyContent: message.sender === 'student' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '0.75rem 1rem',
                        borderRadius: '15px',
                        backgroundColor: message.sender === 'student' ? '#0066CC' : 'white',
                        color: message.sender === 'student' ? 'white' : '#333',
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
              height: 'calc(100vh - 200px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="text-center">
                <FaBuilding size={60} className="text-muted mb-3" />
                <h5 className="text-muted">Sélectionnez une conversation</h5>
                <p className="text-muted">
                  Choisissez une entreprise dans la liste pour commencer à échanger
                </p>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentMessages;