import React, {useEffect, useState} from "react";
import {Row} from "react-bootstrap";
import {MySkeleton} from "../MySkeleton";
import {useError} from "../../context/errorContext";

export const ClientDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const {serverError, setServerError, clearError} = useError()

    useEffect(() => {
        try {
            const data = await

        } catch (error) {
            if (error.response && error.response.data) {
                setServerError(Array.isArray(error.response.data) ? error.response.data : [error.response.data]);
            } else {
                setServerError([{message: 'Error occurred on data fetch', param: "general"}]);
            }
        }
    })

    return (
        <Row>

            {isLoading ? (<MySkeleton title="Client Dashboard"/>) :
                (<div className="dashboard">

                </div>)}


        </Row>
    )
}