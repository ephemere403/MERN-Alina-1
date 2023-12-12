// useAxiosInterceptor.js
import { useEffect } from 'react';
import axios from 'axios';

const useAxiosInterceptor = () => {
    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(response => {

            return response;
        }, error => {


            return Promise.reject(error);
        });

        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);
};

export default useAxiosInterceptor;
