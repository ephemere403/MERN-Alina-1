import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {useUser} from "../context/userContext";
import {LinkContainer} from 'react-router-bootstrap'

export const HeaderNavbar = () => {
    const {username, role, clearUser} = useUser();

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

                    {role === 'client' ? (
                        <LinkContainer to="/create">
                            <Nav.Link>Create Apply</Nav.Link>
                        </LinkContainer>
                    ) : (
                        ''
                    )}

                </Nav>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {username && role ? (
                            <>
                                <LinkContainer to="/profile">
                                    <a>{username}</a>
                                </LinkContainer>
                                <button className="navbar-button" onClick={clearUser}> Log out </button>
                            </>

                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <a>Sign in</a>
                                </LinkContainer>
                            </>

                        )}
                    </Navbar.Text>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}