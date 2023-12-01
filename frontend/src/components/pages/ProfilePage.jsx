import React, {useEffect, useState} from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {useUser} from "../../context/userContext";
import {fetchUserData, updateUser} from "../../api/user";
import {whereIsTheCookie} from "../../api/auth";
import {processServerError} from "../../utils/processServerError";
import {ClientDashboard} from "../profile/ClientDashboard";
import {ManagerDashboard} from "../profile/ManagerDashboard";
import {MySkeleton} from "../MySkeleton";
import {useError} from "../../context/errorContext";


export const ProfilePage = () => {
    const {username, role, clearUser} = useUser();
    const {serverError, setServerError, clearError} = useError();
    const [isLoading, setIsLoading] = useState(true);
    const [serverSuccess, setServerSuccess] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        role: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();


    useEffect(() => {
        clearError()
        const getUserData = async () => {
            if (!username || !role) {
                navigate('/');
            }
            setIsLoading(true);

            try {
                const response = await fetchUserData()

                if (response.error) {
                    throw response.error;
                }

                setUserData({username: response.username, role: response.role, email: response.email})
            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError(Array.isArray(error.response.data) ? error.response.data : [error.response.data]);
                } else {
                    setServerError([{message: 'An unexpected error occurred', param: "general"}]);
                }
            }
            setIsLoading(false);
        }

        getUserData()

    }, [setUserData, clearUser, navigate])

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await updateUser(userData);
            setServerSuccess(response.message)

        } catch (error) {
            const errors = processServerError(error)
            setServerError(errors)
        }

    };


    return (
        <>
            <h1 className="text-center">Profile</h1>
            <Row>
                {
                    serverError.some(err => err.param === 'general') && (
                        <Col className="alert error-field col-12" role="alert">
                            {serverError
                                .filter(err => err.param === 'general')
                                .map((err, index) => <div key={index}>{err.message}</div>)}
                        </Col>
                    )
                }

                {
                    serverSuccess.length > 0 && (
                        <Col className="alert success-field col-12" role="alert">
                            <div> serverSuccess</div>
                        </Col>
                    )
                }

                <Col sm={12} md={3}>
                    {isLoading ? (<MySkeleton title="Your Data"/>) :
                    (<form className="profile-form bg-body-secondary" onSubmit={handleSubmit}>

                        {userData.role === 'client' && (
                            <Col className="profile-field"> <h6>Client</h6> </Col>
                        )}
                        {userData.role === 'manager' && (
                            <Col className="profile-field"> <h6>Manager</h6> </Col>
                        )}

                        <Col className="profile-field">
                            <label htmlFor="usernameInput" className="form-label ">Username</label>
                            <input
                                className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'username') ? 'error-field' : ''}`}
                                id="usernameInput"
                                aria-describedby="usernameErrorBlock"
                                type="text"
                                name="username"
                                placeholder=""
                                value={userData.username}
                                onChange={handleChange}
                            />
                            {
                                serverError.find(err => err.param === 'username') ?
                                    (<div id="usernameErrorBlock"
                                          className="form-text">{serverError.find(err => err.param === 'email').message}</div>) :
                                    ('')
                            }
                        </Col>

                        <Col className="profile-field">
                            <label htmlFor="emailInput" className="form-label">Email</label>
                            <input
                                className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'email') ? 'error-field' : ''}`}
                                id="emailInput"
                                aria-describedby="emailErrorBlock"
                                type="text"
                                name="email"
                                placeholder=""
                                value={userData.email}
                                onChange={handleChange}
                            />
                            {
                                serverError.find(err => err.param === 'email') ?
                                    (<div id="emailErrorBlock"
                                          className="form-text">{serverError.find(err => err.param === 'email').message}</div>) :
                                    ('')
                            }
                        </Col>

                        <Col className="profile-field">
                            <label htmlFor="passwordInput" className="form-label">Password</label>
                            <input
                                className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'password') ? 'error-field' : ''}`}
                                id="passwordInput"
                                aria-describedby="passwordHelpBlock"
                                type="text"
                                name="password"
                                placeholder=""
                                value={userData.password}
                                onChange={handleChange}
                            />
                            {
                                serverError.find(err => err.param === 'password') ?
                                    (<div id="passwordHelpBlock"
                                          className="form-text">{serverError.find(err => err.param === 'password').message}</div>) :
                                    (<div id="passwordHelpBlock" className="form-text">
                                        Your password must be at least 6 characters long, contain capital and small letters,
                                        numbers,
                                        and special symbols
                                    </div>)
                            }
                        </Col>


                        <Button className="auth-button" type="submit"> Update Profile
                        </Button>

                    </form>)}


                </Col>

                {role === 'client' && (

                    <Col sm={12} md={9}>
                        <ClientDashboard/>
                    </Col>
                )}
                {role === 'manager' && (
                    <Col sm={12} md={9}>
                        <ManagerDashboard/>
                    </Col>
                )}
            </Row>
        </>
    );
};

