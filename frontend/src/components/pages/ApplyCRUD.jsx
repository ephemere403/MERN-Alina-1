import {Button, Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useUser} from "../../context/userContext";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useError} from "../../context/errorContext";
import {MySkeleton} from "../MySkeleton";
import {deleteApply, fetchApply, patchApply, postApply} from "../../api/apply";
import {processServerError} from "../../utils/processServerError";
import { CookiesProvider, useCookies } from "react-cookie";

export const ApplyCRUD = () => {
    const [query] = useSearchParams();
    const id = query.get('id')
    const {username, role} = useUser();
    const {serverError, setServerError, clearError} = useError()
    const [serverSuccess, setServerSuccess] = useState([]);
    const [formValid, setFormValid] = useState(false)
    const [cookies, setCookie] = useCookies(['refresh']);
    const [activeInput, setActiveInput] = useState(true)
    const [isLoading, setIsLoading] = useState(true);
    const [applyData, setApplyData] = useState({
        title: '',
        description: '',
        amount: 1000,
        date: formatDate(new Date())
    });


    function formatDate(isoString) {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '01');
        const day = date.getDate().toString().padStart(2, '01');

        return `${year}-${month}-${day}`;
    }

    const navigate = useNavigate();

    const validateForm = () => {
        let errors = [];
        clearError('title')
        clearError('description')
        clearError('amount')
        clearError('date')

        if (!applyData.title || (applyData.title.length > 24 || applyData.title.length < 3)) {
            errors.push({ message: "Title should be 3-24 characters", param: 'title' });
        }

        if (applyData.description.length > 140) {
            errors.push({ message: "Description should be no more than 140 characters", param: 'description' });
        }

        if (!applyData.amount || typeof applyData.amount === 'number') {
            errors.push({ message: "Amount only numeric", param: 'amount' });
        }

        if (!applyData.date || applyData.date.length < 10) {
            errors.push({ message: "Date should be ISO8601(yyyy-mm-dd)", param: 'date' });
        }

        setServerError(errors);
        return errors.length === 0; // Return true if no errors
    }

    const fetchData = async () => {
        try {
            setActiveInput(false)
            const response = await fetchApply(id)
            const formattedApply = { ...response.data, date: formatDate(response.data.date)}
            setApplyData(formattedApply)
        } catch (error) {
            const errors = processServerError(error)
            setServerError(errors)
        }
    }

    useEffect(() => {
        setFormValid(false)
        if (validateForm()) {
            setFormValid(true)
        }

        if (id) {
            setIsLoading(true)
            fetchData()
        }

        if ((!id && role === 'manager') || !username || username === 'null') {
            navigate('/')
        }

        setIsLoading(false)
    }, [applyData ,role, id])

    const handleChange = (e) => {
        setApplyData({...applyData, [e.target.name]: e.target.value});

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = id ? await patchApply(applyData) : await postApply(applyData);

            setServerSuccess(response.message)
            fetchData()
            if (response.data.id) {
                navigate({
                    pathname: '/apply',
                    search: `?id=${response.data.id}`
                })
            }


        } catch (error) {
            const errors = processServerError(error)
            setServerError(errors)
        }
    }

    const deleteSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await deleteApply(id)
            navigate('/')
        } catch (error) {
            const errors = processServerError(error)
            setServerError(errors)
        }
    }

    if (isLoading) {
        return <MySkeleton title="Apply"/>
    }

    return (
        <>

            <h1 className="text-center"> {id ? `Apply №${id.slice(-4)}` : 'Creating an Apply'} </h1>
            <Row>
                {
                    serverError.some(err => err.param === 'general') && (
                        <Col className="alert error-field" role="alert">
                            {serverError
                                .filter(err => err.param === 'general')
                                .map((err, index) => <div key={index}>{err.message}</div>)}
                        </Col>
                    )
                }

                {
                    serverSuccess?.length > 0 && (
                        <Col className="alert success-field" role="alert">
                            <div> serverSuccess</div>
                        </Col>
                    )
                }
                <Col className="col-3"></Col>
                <h6>{String(formValid)}</h6>
                <form className="apply-form bg-body-secondary col-8" onSubmit={handleSubmit}>
                    {/* title */} <Col className='apply-field col-auto' sm={12} md={12}>
                        <label htmlFor="titleInput" className="form-label">Title</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'title') ? 'error-field' : ''}`}
                            id="titleInput"
                            aria-describedby="titleErrorBlock"
                            type="text"
                            name="title"
                            placeholder=""
                            disabled={!activeInput}
                            value={applyData.title}
                            onChange={handleChange}
                        />
                        {
                            serverError.find(err => err.param === 'title') ?
                                (<div id="titleErrorBlock"
                                      className="form-text">{serverError.find(err => err.param === 'title').message}</div>) :
                                ('')
                        } </Col>
                    {/* description */} <Col className='apply-field col-auto'>
                        <label htmlFor="descriptionInput" className="form-label">Description</label>
                        <textarea
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'description') ? 'error-field' : ''}`}
                            id="descriptionInput"
                            aria-describedby="descriptionErrorBlock"
                            rows={2}
                            name="description"
                            placeholder="One sentence"
                            disabled={!activeInput}
                            value={applyData.description}
                            onChange={handleChange}
                        ></textarea>
                        {
                            serverError.find(err => err.param === 'description') ?
                                (<div id="descriptionErrorBlock"
                                      className="form-text">{serverError.find(err => err.param === 'description').message}</div>) :
                                ('')
                        } </Col>
                    {/* amount */} <Col className='apply-field col-auto'>
                        <label htmlFor="amountInput" className="form-label">Amount</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'amount') ? 'error-field' : ''}`}
                            id="amountInput"
                            aria-describedby="amountErrorBlock"
                            step={100}
                            type="number"
                            name="amount"
                            placeholder="in KZT"
                            disabled={!activeInput}
                            value={applyData.amount}
                            onChange={handleChange}
                        />
                        {
                            serverError.find(err => err.param === 'amount') ?
                                (<div id="amountErrorBlock"
                                      className="form-text">{serverError.find(err => err.param === 'amount').message}</div>) :
                                ('')
                        } </Col>
                    {/* date */} <Col className='apply-field col-auto' sm={12}>
                        <label htmlFor="dateInput" className="form-label">Date</label>
                        <input
                            className={`form-control ${Array.isArray(serverError) && serverError.some(err => err.param === 'date') ? 'error-field' : ''}`}
                            id="dateInput"
                            aria-describedby="dateErrorBlock"
                            type="date"
                            name="date"
                            placeholder="by default - today"
                            disabled={!activeInput}
                            value={applyData.date}
                            onChange={handleChange}
                        />
                        {
                            serverError.find(err => err.param === 'date') ?
                                (<div id="dateErrorBlock"
                                      className="form-text">{serverError.find(err => err.param === 'date').message}</div>) :
                                ('')
                        } </Col>
                    <Col className="col-auto input-group">
                        {id && role === 'client' && (<Button className="auth-button focus-ring"
                                                             onClick={() => setActiveInput(!activeInput)}> Edit </Button>)}
                        {role === 'client' && (<Button className="auth-button focus-ring"
                                                       type="submit" disabled={!formValid}> {id ? 'Update' : 'Create'} </Button>)}
                        {id && role === 'client' && (
                            <Button className="auth-button focus-ring" onClick={(deleteSubmit)}> Delete </Button>)}
                        {id && role === 'manager' && (
                            <Button className="auth-button focus-ring" onClick={() => ''}> Save Status </Button>)}
                    </Col>

                </form>
                <Col className="col-3"></Col>

            </Row>
        </>
    )
}