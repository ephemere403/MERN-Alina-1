// src/components/pages/AuthPage.jsx
import React, {useEffect, useState} from 'react';
import {useUser} from '../../context/userContext';
import {loginUser, registerUser} from '../../api/auth';
import {Col, Row} from "react-bootstrap";
import {processServerError} from "../../utils/processServerError";

export const AuthPage = () => {
    const [formValid, setFormValid] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [serverError, setServerError] = useState([]);
    const {setUser} = useUser();


    const validateForm = () => {
        let isValid = true
        if (!isLogin && formData.username) {
            isValid = isValid && formData.username.length > 0;
        }
        isValid = isValid && formData.email.includes('@');
        isValid = isValid && formData.password.length >= 6;
        setFormValid(isValid)
    }

    useEffect(() => {
        validateForm();
    }, [formData, isLogin]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = isLogin ? await loginUser(formData) : await registerUser(formData);
            if (response.username && response.token) {
                //login
                setUser(response.username, response.token);
            }

            setServerError([{message: response}]);
        } catch (error) {
            const errors = processServerError(error)
            setServerError(errors)
            console.log(errors)
        }

    };


    return (
        <Col className="col-6 offset-md-3">
            {
                serverError.some(err => err.param === 'general') && (
                    <Col className="alert error-field" role="alert">
                        {serverError
                            .filter(err => err.param === 'general')
                            .map((err, index) => <div key={index}>{err.message}</div>)}
                    </Col>
                )
            }

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <Row>
                        <label htmlFor="usernameInput" className="form-label">Your username</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'username') ? 'error-field' : ''}`}
                            id="usernameInput"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </Row>
                )}

                <Row>
                    <label htmlFor="emailInput" className="form-label">Email address</label>
                    <input
                        className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'email') ? 'error-field' : ''}`}
                        id="emailInput"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Row>

                <Row>
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
                    <div id="passwordHelpBlock" className="form-text">
                        Your password must be at least 6 characters long, contain capital and small letters,
                        numbers,
                        and special symbols
                    </div>
                </Row>

                <Col className="col-12">
                    <button type="submit" disabled={!formValid}>{isLogin ? 'Login' : 'Register'}</button>
                </Col>

            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
        </Col>

    );
};
