import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {useError} from "../../context/errorContext";
import {useEffect, useState} from "react";
import {fetchAllApplies} from "../../api/apply";
import {processServerError} from "../../utils/processServerError";
import {useUser} from "../../context/userContext";
import {sendSocket} from "../../utils/socket";

export const ApplyView = () => {
    const {serverError, setServerError, clearError} = useError();
    const {username, role} = useUser();
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [applies, setApplies] = useState([]);

    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return new Date(date).toLocaleDateString(undefined, options)
    }

    const fetchData = async () => {
        try {
            const response = await fetchAllApplies(limit, currentPage);
            if (Array.isArray(response.data)) {
                setApplies(response.data);
            } else {
                setServerError(response);
            }
        } catch (error) {
            const errors = processServerError(error);
            setServerError(errors);
        }
    };


    useEffect(() => {
        fetchData();
    }, [limit, currentPage]);

    if (serverError.length > 0) {
        return <>
            {
                serverError.some(err => err.param === 'general') && (
                    <Col className="alert error-field" role="alert">
                        {serverError
                            .filter(err => err.param === 'general')
                            .map((err, index) => <div key={index}>{err.message}</div>)}
                    </Col>
                )
            }
        </>
    }
    return (
        <Container>
            <Row>
                {applies.length === 0 ? (
                    <>
                        <Row>
                            <Col className="col-4"> <img className="img-fluid"
                                                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Banana.png/489px-Banana.png"
                                                         alt="No Applies"/>Seems like no applies</Col>

                        </Row>
                        <Button className="auth-button focus-ring" onClick={fetchData}>Update</Button>
                    </>


                ) : (

                    applies.map((apply) => (
                        <Col className="col-3 apply" key={apply._id}>
                            <h6>{apply.title}</h6>
                            <Col>{apply.description}</Col>
                            <Col>{apply.date}</Col>
                            <Col>Amount: {apply.amount}</Col>
                            <Col>Client: {apply.createdBy.username}</Col>
                            <Col>Status: {apply.status}</Col>
                            {username && role && (<LinkContainer to={{
                                pathname: '/apply',
                                search: `?id=${apply._id}`,
                            }}>
                                <Button>View</Button>
                            </LinkContainer>)}
                        </Col>
                    ))
                )}
                <Button onClick={() => sendSocket('return', 1)}> hello </Button>
            </Row>
        </Container>
    );
};