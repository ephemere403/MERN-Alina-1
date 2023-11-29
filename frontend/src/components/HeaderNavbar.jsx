import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {useUser} from "../context/userContext";
import {LinkContainer} from 'react-router-bootstrap'

export const HeaderNavbar = () => {
    const {username, role, clearUser} = useUser();

    return (
        <>

            <Navbar className="bg-body-secondary navbar-expand-md">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>AlinaEx Portal</Navbar.Brand>
                    </LinkContainer>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="">a</span>
                    </button>


                    <Navbar.Collapse className="justify-content-end" id="navbarToggler">
                        <Nav className="">
                            <LinkContainer to="/applies">
                                <Nav.Link> Applies </Nav.Link>
                            </LinkContainer>

                            {role === 'client' ? (
                                <LinkContainer to="/apply-create">
                                    <Nav.Link>Create Apply</Nav.Link>
                                </LinkContainer>
                            ) : (
                                ''
                            )}

                        </Nav>

                        <Navbar.Text>
                            {username && role ? (
                                <>
                                    <LinkContainer to="/profile">
                                        <a>{username}</a>
                                    </LinkContainer>
                                    <a className="navbar-button" onClick={clearUser}> Log out </a>
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
        </>

    )
}