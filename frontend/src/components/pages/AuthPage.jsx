// src/components/pages/AuthPage.jsx
import React, {useEffect, useState} from 'react';
import {useUser} from '../../context/userContext';
import {loginUser, registerUser} from '../../api/auth';
import {Button, Col, Row} from "react-bootstrap";
import {processServerError} from "../../utils/processServerError";
import {useNavigate} from "react-router-dom";
import {useError} from "../../context/errorContext";

export const AuthPage = () => {
    const [formValid, setFormValid] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const {serverError, setServerError, clearError} = useError()
    const [serverSuccess, setServerSuccess] = useState([])
    const {username, role, setUser} = useUser();
    const navigate = useNavigate()


    const validateForm = () => {
        let errors = [];
        let filter = /[^@]+@[^@]+\.[^@]+/;

        clearError('username')
        clearError('email')
        clearError('password')

        if (!isLogin && (!formData.username || formData.username.length === 0)) {
            errors.push({ message: "No username given", param: 'username' });
        }

        if (formData.email && !filter.test(formData.email)) {
            errors.push({ message: "Email is not in correct format", param: 'email' });
        }

        if (formData.password && formData.password.length <= 5) {
            errors.push({ message: "Password should be minimum 6 characters", param: 'password' });
        }

        setServerError(errors);
        return errors.length === 0; // Return true if no errors
    };


    useEffect(() => {
        setFormValid(validateForm())
        if (username!=='null' && username) {
            navigate('/profile');
        }

    }, [formValid, username, role, formData, navigate]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formValid){
            validateForm()
            return
        }

        try {
            const response = isLogin ? await loginUser(formData) : await registerUser(formData);
            setServerSuccess(response)
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
        <Row>
            <Col className="col-3"></Col>

            <Col className="col-6  bg-body-secondary auth-form">
                <h1 className="text-center"> Authentication</h1>

                {
                    serverError.some(err => err.param === 'general') && (
                        <Col className="alert error-field" role="alert">
                            {serverError
                                .filter(err => err.param === 'general')
                                .map((err, index) => <div key={index}>{err.message}</div>)}
                        </Col>
                    )
                }


                {
                    serverSuccess.length > 0 && (
                        <Col className="alert success-field" role="alert">
                            <div>{serverSuccess}</div>
                        </Col>
                    )
                }

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Row className="auth-field">
                            <label htmlFor="usernameInput" className="form-label">Your username</label>
                            <input
                                className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'username') ? 'error-field' : ''}`}
                                id="usernameInput"
                                aria-describedby="usernameErrorBlock"
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {
                                serverError.find(err => err.param === 'username') ?
                                    (<div id="usernameErrorBlock"
                                          className="form-text">{serverError.find(err => err.param === 'email').message}</div>) :
                                    ('')
                            }
                        </Row>
                    )}

                    <Row className="auth-field">
                        <label htmlFor="emailInput" className="form-label">Email address</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'email') ? 'error-field' : ''}`}
                            id="emailInput"
                            aria-describedby="emailErrorBlock"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {
                            serverError.find(err => err.param === 'email') ?
                                (<div id="emailErrorBlock"
                                      className="form-text">{serverError.find(err => err.param === 'email').message}</div>) :
                                ('')
                        }
                    </Row>

                    <Row className="auth-field">
                        <label htmlFor="passwordInput" className="form-label">Password</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'password') ? 'error-field' : ''}`}
                            id="passwordInput"
                            aria-describedby="passwordHelpBlock"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
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
                    </Row>

                    <Col className="col-12 input-group">
                        <Button className="auth-button focus-ring" type="submit"
                                disabled={!formValid}>{isLogin ? 'Login' : 'Register'}
                        </Button>

                        <Button className="auth-button focus-ring" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                        </Button>
                    </Col>
                </form>

            </Col>
            <Col className="col-3"></Col>
        </Row>

    );
};
