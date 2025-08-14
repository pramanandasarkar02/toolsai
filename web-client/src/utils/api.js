import axios from "axios";

const unAuthorizedInstances = axios.create({
    baseURL: "https://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

const authorizedInstances = axios.create({
    baseURL: "https://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
});

export { unAuthorizedInstances, authorizedInstances };