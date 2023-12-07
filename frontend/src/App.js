// noinspection ES6CheckImport

import {Container} from "react-bootstrap";
import {Route, Routes, Navigate} from "react-router-dom";
import {HeaderNavbar} from "./components/HeaderNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {LinkContainer} from 'react-router-bootstrap'
import {ToastContainer, toast} from 'react-toastify';
import {AuthPage} from "./components/pages/AuthPage";
import {ProfilePage} from "./components/pages/ProfilePage";
import {ApplyView} from "./components/pages/ApplyView";
import {ApplyCRUD} from "./components/pages/ApplyCRUD";
import {NotFound} from "./components/pages/NotFound";
import {VerifyAuthPage} from "./components/pages/VerifyAuthPage";
import {useEffect} from "react";
import {disconnectSocket, initiateSocketConnection, sendSocket} from "./utils/socket";
import {useNotifications} from "./context/notificationContext";
import {useUser} from "./context/userContext";

const NotificationToast = ({applyId, title}) => (
    <div>
        {title}
        <LinkContainer to={{
            pathname: '/apply',
            search: `?id=${applyId}`,
        }}>
            <button>View Apply</button>
        </LinkContainer>
    </div>
);

function App() {
    const {notifications, setNotifications, clearNotifications} = useNotifications()
    const {username, role} = useUser();

    useEffect(() => {

        const socket = initiateSocketConnection();

        socket.on('notification', (data) => {
            let news = {...data}
            if (role === 'manager') {
                news.title = 'New application published'
            } else if (role === 'client') {
                news.title = 'Your apply status has been changed'
            }
            setNotifications(...notifications, news)
            toast(<NotificationToast applyId={news.applyId} title={news.title}/>);
        })

        return () => {
            disconnectSocket();
        };
    }, [username, role, notifications, setNotifications]);

    return (
        <>
            <HeaderNavbar></HeaderNavbar>
            <Container fluid>
                <Routes>
                    <Route exact path="/" element={<ApplyView/>}/>
                    <Route path="/applies" element={<ApplyView/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/login" element={<AuthPage/>}/>
                    <Route path="/logout" element={<AuthPage/>}/>
                    <Route path="/verify" element={<VerifyAuthPage/>}/>
                    <Route path="/apply-create" element={<ApplyCRUD/>}/>
                    <Route path="/apply" element={<ApplyCRUD/>}/>
                    <Route path="/not-found" element={<NotFound/>}/>
                    <Route path="*" element={<Navigate to="/not-found"/>}/>
                </Routes>
                <ToastContainer position="bottom-right"
                                draggable
                                pauseOnHover
                                autoClose={12000}/>
            </Container>

        </>


    );
}

export default App;
