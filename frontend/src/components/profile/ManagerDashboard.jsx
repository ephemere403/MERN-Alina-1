import React, {useState,useEffect} from "react"
import {Button} from "react-bootstrap";
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

    const dataFetch = async () => {
        try {
            const apiData = await fetchManagerData(1, 20)
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
        return <div className="alert error-field dashboard" role="alert">
            {serverError
                .filter(err => err.param === 'data')
                .map((err, index) => <div key={index}>{err.message}</div>)
            }
            <Button onClick={dataFetch()}> Refresh </Button>
        </div>
    }

    if (isLoading) {
        return <MySkeleton title="Client Dashboard"/>
    }

    return (
        <div className="dashboard">
            { graphData.hasData? (<Bar data={graphData} options={barChartOptions('Your applies')}/>)
                : (<> No Applies yet! </>) }
        </div>

    )
}