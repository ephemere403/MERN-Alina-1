// noinspection ES6CheckImport

import {Container} from "react-bootstrap";
import {Route, Routes, Navigate} from "react-router-dom";
import {HeaderNavbar} from "./components/HeaderNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthPage} from "./components/pages/AuthPage";
import {ProfilePage} from "./components/pages/ProfilePage";
import {ApplyView} from "./components/pages/ApplyView";
import {ApplyCRUD} from "./components/pages/ApplyCRUD";
import {NotFound} from "./components/pages/NotFound";
import {VerifyAuthPage} from "./components/pages/VerifyAuthPage";


function App() {
    return (
        <>
            <HeaderNavbar></HeaderNavbar>
            <Container>
                <Routes>
                    <Route exact path="/" element={<ApplyView/>}/>
                    <Route path="/applies" element={<ApplyView/>}></Route>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/login" element={<AuthPage/>}/>
                    <Route path="/verify" element={<VerifyAuthPage/>}/>
                    <Route path="/create" element={<ApplyCRUD/>}/>
                    <Route path="/update" element={<ApplyCRUD/>}/>
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/not-found" />} />
                </Routes>
            </Container>
        </>



    );
}

export default App;
