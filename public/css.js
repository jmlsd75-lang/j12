body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}
h1 { font-size: 28px; color: blue; margin: 0; }
h2 { font-size: 18px; color: red; margin: 5px 0 30px 0; }
.login-btn, .logout-btn {
  padding: 15px 40px;
  font-size: 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
}
.login-btn { background: #28a745; }
.logout-btn { background: #dc3545; display: none; margin-top: 20px; }
#userDisplay { margin-bottom: 20px; font-weight: bold; display: none; }
