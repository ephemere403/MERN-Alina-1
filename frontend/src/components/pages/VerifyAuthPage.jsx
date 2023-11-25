import React, {useEffect, useState} from "react";
import {Link, useSearchParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {useUser} from "../../context/userContext";
import ResendVerificationEmail from "../ResendVerificationEmail";
import {Col, Row} from "react-bootstrap";

export const VerifyAuthPage = () => {
    const [searchParams] = useSearchParams();
    const [serverError, setServerError] = useState([]);
    const {setUser} = useUser();
    const [shouldShowResend, setShouldShowResend] = useState(false);
      const navigate = useNavigate()

    useEffect(() => {
        const verifyUser = async () => {
            const token = searchParams.get("token");
            if (!token) {
                setServerError([{message: "No token provided.", param: "general"}]);
                setShouldShowResend(true);
                return;
            }

            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify?token=${token}`);
                setUser(response.data.username);
                // Redirect user to home page or dashboard after successful verification
                navigate('/profile')

            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError(Array.isArray(error.response.data) ? error.response.data : [error.response.data]);
                    setShouldShowResend(true);
                } else {
                    setServerError([{message: 'An unexpected error occurred', param: "general"}]);
                    setShouldShowResend(false);
                }
            }
        };

        verifyUser();
    }, [searchParams]);

    return (
        <Row>
            <Col className="col-3"></Col>
            <Col className="col-6 bg-body-secondary auth-form">
                <h1 className="text-center"> Verifying your account...</h1>
                {
                    serverError.length > 0 && (
                        <div className="alert alert-danger" role="alert">
                            {serverError.map((err, index) => (
                                <div key={index}>{err.message}</div>
                            ))}
                        </div>
                    )
                }
                {shouldShowResend && <ResendVerificationEmail/>}
                <Link to="/login">Return to Authentication</Link>
            </Col>
            <Col className="col-3"></Col>
        </Row>

    );
};
