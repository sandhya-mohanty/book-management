export const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
