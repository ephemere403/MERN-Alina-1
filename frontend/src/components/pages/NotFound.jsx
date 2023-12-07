import React from "react";
import {Container} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'

export const NotFound = () => {
    return (
        <Container>
            <p>there's nothing here but us chickens</p>
            <LinkContainer to="/">
                <a> Get me Home </a>
            </LinkContainer>
        </Container>)
}