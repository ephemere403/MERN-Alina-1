// noinspection ES6CheckImport

import {Container} from "react-bootstrap";
import {Route, Routes, Navigate} from "react-router-dom";
import {HeaderNavbar} from "./components/HeaderNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import {AuthPage} from "./components/pages/AuthPage";
import {ProfilePage} from "./components/pages/ProfilePage";
import {ApplyView} from "./components/pages/ApplyView";
import {ApplyCRUD} from "./components/pages/ApplyCRUD";
import {NotFound} from "./components/pages/NotFound";
import {VerifyAuthPage} from "./components/pages/VerifyAuthPage";
import {useEffect} from "react";
import {disconnectSocket, initiateSocketConnection} from "./utils/socket";
import {useNotifications} from "./context/notificationContext";


function App() {
    const {notifications, setNotifications, clearNotifications} = useNotifications()

    useEffect(() => {
        const socket = initiateSocketConnection();

        socket.on('newApply', (data) => {
            setNotifications(...notifications, data)
            toast(data.message);
        });

        socket.on('hello', (data) => {
            toast(data.message);
        })

        return () => {
            disconnectSocket();
        };
    }, []);

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
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/not-found" />}/>
                </Routes>
            </Container>
            <ToastContainer position="bottom-right" autoClose={120000}/>
        </>



    );
}

export default App;
