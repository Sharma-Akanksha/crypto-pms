function logoutUser(navigate, isAdmin = false) {
  if(isAdmin){
    localStorage.removeItem('pms_admin_token');
    navigate('/admin-login');
  }else{
    localStorage.removeItem('pms_token');
    navigate('/login');
  }
}

module.exports = { logoutUser };