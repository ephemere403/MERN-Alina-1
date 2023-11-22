import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {useUser} from "../context/userContext";
import {LinkContainer} from 'react-router-bootstrap'

export const HeaderNavbar = () => {
    const { username } = useUser();

    return (
        <Navbar className="bg-body-secondary" >
            <Container>
                <Navbar.Brand href="/">AlinaEx Portal</Navbar.Brand>

                <Nav className="">
                    <LinkContainer to="/applies">
                        <Nav.Link> Applies </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/create">
                        <Nav.Link> Create Apply </Nav.Link>
                    </LinkContainer>
                </Nav>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {username ? (
                            <LinkContainer to="/profile">
                                <a href="/">Signed in as: {username}</a>
                            </LinkContainer>
                        ) : (
                            <LinkContainer to="/login">
                                <a href="/">Login</a>
                            </LinkContainer>
                        )}
                    </Navbar.Text>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}