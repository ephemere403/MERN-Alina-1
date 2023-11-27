import React, {useState} from "react"
import {Row} from "react-bootstrap";
import {MySkeleton} from "../MySkeleton";

export const ManagerDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Row>
            {isLoading ? (<MySkeleton title="Client Dashboard"/>) :
                (<div className="dashboard">

                </div>)}


        </Row>
    )
}