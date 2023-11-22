import React, {useEffect, useState} from "react";
import {Link, useSearchParams} from "react-router-dom";
import axios from "axios";
import {useUser} from "../../context/userContext";
import ResendVerificationEmail from "../ResendForm";

export const VerifyAuthPage = () => {
    const [searchParams] = useSearchParams();
    const [serverError, setServerError] = useState([]);
    const {setUser} = useUser();
    const [shouldShowResend, setShouldShowResend] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = searchParams.get('token');
            if (!token) {
                setServerError([{ message: "No token provided.", param: "general" }]);
                setShouldShowResend(true);
                return;
            }

            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify`, { token });
                setUser(response.data.username, response.data.token);
                // Redirect user to home page or dashboard after successful verification
            } catch (error) {
                if (error.response && error.response.data) {
                    setServerError(Array.isArray(error.response.data) ? error.response.data : [error.response.data]);
                    setShouldShowResend(true);
                } else {
                    setServerError([{ message: 'An unexpected error occurred', param: "general" }]);
                    setShouldShowResend(false);
                }
            }
        };

        verifyUser();
    }, [searchParams]);

    return (
        <div>
            <h1>Verifying your account...</h1>
            {
                serverError.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                        {serverError.map((err, index) => (
                            <div key={index}>{err.message}</div>
                        ))}
                    </div>
                )
            }
            {shouldShowResend && <ResendVerificationEmail />}
            <Link to="/login">Return to Authentication</Link>
        </div>

    );
};
