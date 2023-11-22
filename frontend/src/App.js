import {Container, Row} from "react-bootstrap";
import {Route, Routes} from "react-router-dom";
import {HeaderNavbar} from "./components/HeaderNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthPage} from "./components/pages/AuthPage";
import {ProfilePage} from "./components/pages/ProfilePage";
import {ApplyView} from "./components/pages/ApplyView";
import {ApplyCRUD} from "./components/pages/ApplyCRUD";


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
                    <Route path="/create" element={<ApplyCRUD/>}/>
                </Routes>
            </Container>
        </>



    );
}

export default App;
