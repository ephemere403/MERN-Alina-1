import {Col} from "react-bootstrap";
import React from "@types/react";

export const LoginForm = () => {
    return(
        <Col className="col-6 offset-md-3">
            <h3>  </h3>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                )}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
        </Col>
    )
}