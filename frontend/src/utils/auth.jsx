// Get JWT token from localStorage
export function getToken() {
  return localStorage.getItem('token');
}
// Set JWT token in localStorage
export function setToken(token) {
  localStorage.setItem('token', token);
}
// Remove JWT token from localStorage
export function clearToken() {
  localStorage.removeItem('token');
}
// Check if a token exists
export function isAuthenticated() {
  return !!getToken();
}
