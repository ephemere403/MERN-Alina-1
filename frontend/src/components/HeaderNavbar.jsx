import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {useUser} from "../context/userContext";
import {LinkContainer} from 'react-router-bootstrap'

export const HeaderNavbar = () => {
    const {username, role} = useUser();

    return (
        <Navbar className="bg-body-secondary">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>AlinaEx Portal</Navbar.Brand>
                </LinkContainer>

                <Nav className="">
                    <LinkContainer to="/applies">
                        <Nav.Link> Applies </Nav.Link>
                    </LinkContainer>

                    {role === 'manager' ? (
                        <LinkContainer to="/create">
                            <Nav.Link>Create Apply</Nav.Link>
                        </LinkContainer>
                    ) : (
                        ''
                    )}

                </Nav>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {username ? (
                            <LinkContainer to="/profile">
                                <a href="/">{username}</a>
                            </LinkContainer>
                        ) : (
                            <LinkContainer to="/login">
                                <a href="/">Sign in</a>
                            </LinkContainer>
                        )}
                    </Navbar.Text>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}