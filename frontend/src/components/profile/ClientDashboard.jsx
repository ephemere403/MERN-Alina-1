import React, {useEffect, useState} from "react";
import {Button, Col} from "react-bootstrap";
import {MySkeleton} from "../MySkeleton";
import {useError} from "../../context/errorContext";
import {fetchClientData} from "../../api/user";
import {processServerError} from "../../utils/processServerError";
import {Bar} from "react-chartjs-2";
import {barChartOptions, processDataToGraph} from "../../utils/processDataToGraph";
import {LinkContainer} from "react-router-bootstrap";

export const ClientDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const {serverError, setServerError, clearError} = useError()
    const [graphData, setGraphData] = useState({});

    const dataFetch = async () => {
        try {
            const apiData = await fetchClientData(1, 20)

            if (apiData.error) {
                throw apiData.error;
            }

            const processed = processDataToGraph(apiData)
            setGraphData(processed)
            setIsLoading(false)

        } catch (error) {
            if (error.response && error.response.data) {
                setServerError(Array.isArray(error.response.data) ? error.response.data : [error.response.data]);
            } else {
                const errors = processServerError(error)
                setServerError(errors)
            }
        }
    }

    useEffect(() => {
        clearError()
        dataFetch()

    }, [])

    if (serverError.some(err => err.param === 'data')) {
        return <Col className="alert error-field" role="alert">
            {serverError
                .filter(err => err.param === 'data')
                .map((err, index) => <div key={index}>{err.message}</div>)
            }
            <Button onClick={dataFetch()}> Refresh </Button>
        </Col>
    }

    if (isLoading) {
        return <MySkeleton title="Client Dashboard"/>
    }

    return (
        <div className="dashboard bg-body-secondary">
            { graphData.hasData? (<Bar data={graphData} options={barChartOptions('Your applies')}/>)
                : (
                    <Col className="text-center "> Seems like nothing here but us chickens <LinkContainer to="/apply-create">

                        <Col> <a> Create an apply? </a></Col>
                    </LinkContainer> </Col>
                ) }
        </div>

    )
}