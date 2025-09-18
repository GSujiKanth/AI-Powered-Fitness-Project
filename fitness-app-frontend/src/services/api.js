import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL:API_URL
})

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    //const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhQnJBTWw1aFV4cWVsR0pNaThUOEF3U3IxbUVMRktNNjZYVjZ3eE9IQ0hNIn0.eyJleHAiOjE3NTgyMDgwMzEsImlhdCI6MTc1ODIwNzczMSwiYXV0aF90aW1lIjoxNzU4MjA3NzMwLCJqdGkiOiJvbnJ0YWM6MzNiNTZkOWQtNGVhMC1mM2ZjLTY3MjQtMWVlMGJjOWJlZTdmIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTgxL3JlYWxtcy9maXRuZXNzLW9hdXRoMiIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI2ODVjMDdjZS1iZjczLTQwNWMtOTI2My1jNDYzZjhkN2M2MWIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJvYXV0aDItcGtjZS1jbGllbnQiLCJzaWQiOiI2NzgzODNjMi1hNzVjLTRhNTktYmJkYy0xNGY0YjQxNzVjNWIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjUxNzMiLCIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWZpdG5lc3Mtb2F1dGgyIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InVzZXIxIGxhc3QgbmFtZTEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ1c2VyMSIsImdpdmVuX25hbWUiOiJ1c2VyMSIsImZhbWlseV9uYW1lIjoibGFzdCBuYW1lMSIsImVtYWlsIjoidXNlcjFAZ21haWwuY29tIn0.FOmithp32pBEQdPbQd6aCUHVY4cJRCFjmVFnipaj7YYb47aBeQGYTO_hI0zDhRIqEmSodAF276n_cd6p1XxXpmW-gLwa4mQkVjfelmqWAOS4OORirsFFvrR5GF1JqK4BILZLZd0UodL9GpPuX8A02QF8qvOpj2A9dzxNuR0nQlzH0kN9H-xRx-3N41kaNNubVADl5QtlH3UWxw2H-t41gjCLbV_jKFy4dpAN_Iypell2ONorVjRh4BDP4X_QcB83DU-IsIGQmw229bM5im_qXqB51K3MFK3zvr7fi7xzb04Wszw0mGk4DOTIiw5iPEorCPTkIkZbGNFudrclqDkNCQ"

    console.log("[DEBUG] userId "+ userId)
    console.log("[DEBUG] token "+ token.slice)
    //console.log("[DEBUG] token "+ token.data)

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // pass the token for authoriztion within requests
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
});

export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = () => api.get('/recommendations/activity/${id}');