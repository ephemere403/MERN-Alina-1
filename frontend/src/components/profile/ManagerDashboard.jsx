import React, {useState,useEffect} from "react"
import {Button, Col} from "react-bootstrap";
import {MySkeleton} from "../MySkeleton";
import {useError} from "../../context/errorContext";
import {fetchManagerData} from "../../api/user";
import {barChartOptions, processDataToGraph} from "../../utils/processDataToGraph";
import {processServerError} from "../../utils/processServerError";
import {Bar} from "react-chartjs-2";

export const ManagerDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const {serverError, setServerError, clearError} = useError()
    const [graphData, setGraphData] = useState({});
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    const dataFetch = async () => {
        try {
            const apiData = await fetchManagerData(limit, currentPage)

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
        <div className="dashboard">
            { !graphData.hasData? (<Bar data={graphData} options={barChartOptions('History')}/>)
                : (<Col>Less work for today! No applies</Col>) }
        </div>

    )
}