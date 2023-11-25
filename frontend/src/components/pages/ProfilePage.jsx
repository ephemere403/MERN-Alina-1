import React, {useEffect, useState} from 'react';
import {Container, Row, Col, InputGroup, Button} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {useUser} from "../../context/userContext";
import {fetchUserEmail, whereIsTheCookie} from "../../api/user";
import {loginUser, registerUser} from "../../api/auth";
import {processServerError} from "../../utils/processServerError";


export const ProfilePage = () => {
    const {username, role} = useUser();
    const [serverError, setServerError] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        role: '',
        email: ''
    });
    const navigate = useNavigate();



    useEffect(() => {

        const getUserData = async () => {
            if (!username || !role) {
                navigate('/');
            }

            try{
                const token = await whereIsTheCookie()
                console.log(token)
                // const response = await fetchUserEmail({
                //     method: 'GET',
                //     credentials: 'include'
                // })
                // setUserData(username, role, response.data.email)
            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError(Array.isArray(error.response.data) ? error.response.data : [error.response.data]);
                } else {
                    setServerError([{message: 'An unexpected error occurred', param: "general"}]);
                }
            }
        }
        getUserData()

    },[username, role, navigate])

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response =  await loginUser(userData);
            if (response.username && response.role) {
                //login
                setUser(response.username, response.role); //code smells?
            }

        } catch (error) {
            const errors = processServerError(error)
            setServerError(errors)
        }

    };



    return (
        <Container>
            <Row>
                <h1 className="text-center">Profile</h1>
                <Col className="col-3 bg-body-secondary">
                    {
                        serverError.length > 0 && (
                            <div className="alert alert-danger" role="alert">
                                {serverError.map((err, index) => (
                                    <div key={index}>{err.message}</div>
                                ))}
                            </div>
                        )
                    }
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="usernameInput" className="form-label">Username</label>
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

                        <label htmlFor="emailInput" className="form-label">Email</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'email') ? 'error-field' : ''}`}
                            id="emailInput"
                            aria-describedby="emailErrorBlock"
                            type="text"
                            name="email"
                            placeholder=""
                            value={userData.username}
                            onChange={handleChange}
                        />

                        <div className="form-label">{userData.role}</div>

                        <label htmlFor="passwordInput" className="form-label">Password</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'password') ? 'error-field' : ''}`}
                            id="passwordInput"
                            aria-describedby="emailErrorBlock"
                            type="text"
                            name="password"
                            placeholder=""
                            value={userData.username}
                            onChange={handleChange}
                        />

                        <Button className="auth-button" type="submit"> Update Profile
                        </Button>

                    </form>


                </Col>
                {/*{role === 'client' && (*/}
                {/*    <>*/}
                {/*        <Col md={6}>*/}
                {/*            <ClientDashboard />*/}
                {/*        </Col>*/}
                {/*        <Col md={3}>*/}
                {/*            <UserAppliesList />*/}
                {/*        </Col>*/}
                {/*    </>*/}
                {/*)}*/}
                {/*{role === 'manager' && (*/}
                {/*    <Col md={9}>*/}
                {/*        <ManagerAppliesList />*/}
                {/*    </Col>*/}
                {/*)}*/}
            </Row>
        </Container>
    );
};

