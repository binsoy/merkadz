import React from "react";

const parentDiv = {
  display: "flex",
  width: 230,
  margin: "0 auto",
  flexFlow: "column",
  justifyContent: "space-between",
  height: 50,
};

const containerControl = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
};

const LoginMarkup = (props) => {
  return (
    <div>
      <div>
        <div>
          <div style={parentDiv}>
            <div style={containerControl}>
              <label style={{ marginRight: 10 }}>Email</label>
              <input
                type="text"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
              />
            </div>
            <div style={containerControl}>
              <label style={{ marginRight: 10 }}>Password</label>
              <input
                type="password"
                value={props.password}
                onChange={(e) => props.setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          <button onClick={props.handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginMarkup;
