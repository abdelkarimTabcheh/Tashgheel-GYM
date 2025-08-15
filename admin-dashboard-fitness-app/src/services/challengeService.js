import API from './api';

export const fetchChallenges = () => API.get('/admin/challenges');
export const createChallenge = (data) => API.post('/admin/challenges', data);
export const updateChallenge = (id, data) => API.put(`/admin/challenges/${id}`, data);
export const deleteChallenge = (id) => API.delete(`/admin/challenges/${id}`);
