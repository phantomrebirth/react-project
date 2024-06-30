import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiUrl from '../components/ApiUrl';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Container, Row, Col, Card } from 'react-bootstrap';
import LoadingSpinner from '../redux/actions/LoadingSpinner';

const Chats = ({ token }) => {
  const [chats, setChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/chats`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
        },
      });
      setChats(response.data);
      setIsLoadingChats(false);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const openChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const renderLastMessage = (lastMessage) => {
    if (!lastMessage) return null;
    const { text, createdAt } = lastMessage;
    const formattedDate = format(new Date(createdAt), 'PPpp');
    return (
      <div>
        <div className="text-muted">{text}</div>
        <div className="text-muted small">{formattedDate}</div>
      </div>
    );
  };

  const cardStyle = {
    width: '50rem', // Increased width
    height: '12rem', // Increased height
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
    margin: '10px',
    cursor: 'pointer'
  };

  const cardBodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  };

  const cardTitleStyle = {
    color: '#343a40',
    marginBottom: '10px'
  };

  const cardTextStyle = {
    color: '#495057'
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '100%' }}>
      {isLoadingChats ? (
        <LoadingSpinner />
      ) : (
        <Row className="justify-content-center">
          {chats.map((chat) => (
            <Col xs={12} md={6} lg={4} key={chat._id} className="d-flex justify-content-center">
              <Card style={cardStyle} onClick={() => openChat(chat._id)}>
                <Card.Body style={cardBodyStyle}>
                  <Card.Title style={cardTitleStyle}>{chat.name}</Card.Title>
                  <Card.Text style={cardTextStyle}>
                    {renderLastMessage(chat.lastMessage)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(Chats);