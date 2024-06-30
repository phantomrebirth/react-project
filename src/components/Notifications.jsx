import React, { useEffect, useRef, useState } from 'react';
import { FaBell, FaRegBell } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';
import { login } from '../redux/actions/auth';
import { connect } from 'react-redux';
import apiUrl from './ApiUrl';

const Notifications = ({
    token,
    role
}) => {
    const [bellClicked, setBellClicked] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notificationRef = useRef(null);
    const socket = useRef(null);

    const handleBellClick = () => {
        setNotificationDropdownOpen(!notificationDropdownOpen);
        setBellClicked(true);
    };

    useEffect(() => {
        const handleNotificationClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                notificationRef.current.querySelector('.notification-dropdown') &&
                !notificationRef.current.querySelector('.notification-dropdown').contains(event.target)
            ) {
                setNotificationDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleNotificationClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleNotificationClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${apiUrl}/notifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true',
                    }
                });
                console.log('Fetched notifications:', response.data.notifications);
                if (Array.isArray(response.data.notifications)) {
                    setNotifications(response.data.notifications);
                } else {
                    console.error('Fetched notifications are not an array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        socket.current = io(`${apiUrl}`, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
            extraHeaders: {
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
            },
        });

        socket.current.on('connection', () => {
            console.log('Socket.IO connected successfully');
        });

        socket.current.on('notification', (notification) => {
            console.log('Received notification:', notification);
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        });

        socket.current.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
        });

        socket.current.on('connect_timeout', (timeout) => {
            console.error('Socket.IO connection timeout:', timeout);
        });

        socket.current.on('reconnect_attempt', (attempt) => {
            console.log(`Socket.IO reconnect attempt ${attempt}`);
        });

        socket.current.on('reconnect_failed', () => {
            console.error('Socket.IO reconnect failed');
        });

        socket.current.on('disconnect', () => {
            console.log('Socket.IO connection disconnected');
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const markAsRead = async (id) => {
        try {
            const response = await axios.patch(`${apiUrl}/notifications/${id}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            if (response.status === 200) {
                setNotifications((prevNotifications) =>
                    prevNotifications.map((notification) =>
                        notification._id === id ? { ...notification, isRead: true } : notification
                    )
                );
                console.log(response.data)
            } else {
                console.error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="notifications-container" ref={notificationRef}>
            <div className="bell-container" onClick={handleBellClick}>
                <div className="notifications">
                    {!bellClicked && notifications.some(notification => !notification.isRead) && (
                        <div className="notifications-num">
                            {notifications.filter(notification => !notification.isRead).length}
                        </div>
                    )}
                </div>
                {notificationDropdownOpen ? (
                    <FaBell className="bell" style={{ color: "#fff" }} />
                ) : (
                    <FaRegBell className="bell" />
                )}
                {notificationDropdownOpen && (
                    <div className="notification-dropdown">
                        <div className="notifications-headerContainer">
                            <p className="notifications-header">Notifications</p>
                        </div>
                        <div className="notification-items">
                            {notifications.map((notification, index) => (
                                <div key={index} className={`notification-dropdown-item ${notification.isRead ? 'read' : 'unread'}`} onClick={() => markAsRead(notification._id)} style={{ cursor: 'pointer' }}>
                                    <div className='announcements-container'>
                                        <div className='announcement-container'>
                                            <div className='annIcon-container' style={{marginRight: "0.5rem"}}>
                                                <h4 className='announcement-icon'> ! </h4>
                                            </div>
                                            <a href={notification.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: "flex", flexDirection: "column" }}>
                                                {notification.message}
                                            </a>
                                            <div style={{ marginTop: 'auto', fontStyle: 'italic', fontSize: '0.65em' }}>
                                                {formatDate(notification.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    role: state.auth.role,
    token: state.auth.token,
    courses: state.courses.coursesData,
    currentCourseID: state.courses.currentCourseID,
    isLoading: state.courses.isLoading,
});

export default connect(mapStateToProps, { login })(Notifications);