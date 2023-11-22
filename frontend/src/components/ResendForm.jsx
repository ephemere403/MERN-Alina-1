import React, { useState } from 'react';
import axios from 'axios';

const ResendVerificationEmail = () => {
    const [email, setEmail] = useState('');
    const [showResendForm, setShowResendForm] = useState(false);
    const [serverError, setServerError] = useState([]);
    const [resendSuccess, setResendSuccess] = useState(false);

    const handleResendEmail = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/resend`, { email });
            // Handle success response, perhaps show a message that the email was sent successfully
            setResendSuccess(true);
            setServerError([]);
        } catch (error) {
            // Handle errors, perhaps display an error message
            if (error.response && error.response.data) {
                setServerError(Array.isArray(error.response.data) ? error.response.data : [error.response.data]);
            } else {
                setServerError([{ message: 'An unexpected error occurred' }]);
            }
            setResendSuccess(false);
        }
    };

    return (
        <div>
            {showResendForm ? (
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <button onClick={handleResendEmail}>Resend Email</button>
                </div>
            ) : (
                <button onClick={() => setShowResendForm(true)}>Resend Verification Email</button>
            )}

            {resendSuccess && <div>Email sent successfully! Please check your inbox.</div>}

            {serverError.length > 0 && (
                <div className="alert alert-danger" role="alert">
                    {serverError.map((err, index) => (
                        <div key={index}>{err.message}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResendVerificationEmail;
