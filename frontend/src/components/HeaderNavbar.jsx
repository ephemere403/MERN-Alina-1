import React, {useEffect} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {useUser} from "../context/userContext";
import {LinkContainer} from 'react-router-bootstrap'
import {useNotifications} from "../context/notificationContext";
import {NotificationAlert} from "../img/notificationAlert";
import {NotificationBell} from "../img/notificationBell";

export const HeaderNavbar = () => {
    const {username, role, clearUser} = useUser();
    const {notifications, setNotifications, clearNotifications} = useNotifications()

    useEffect(() => {
    }, [username, role])

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
                        {notifications.length > 0 ? (<NotificationAlert classname="img-fluid"/>)
                            : (<NotificationBell classname="img-fluid"/>)}


                    {username!=='null' && username ? (
                        <>
                            <LinkContainer to="/profile">
                                <button className="navbar-button">{username}</button>
                            </LinkContainer>
                            <button className="navbar-button" onClick={clearUser}> Log out</button>
                        </>

                    ) : (
                        <>
                            <LinkContainer to="/login">
                                <button className="navbar-button">Sign in</button>
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