import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import axios from "axios";
import jwtDecode from "jwt-decode";

import LoginMarkup from "./pages/login";
import SignupMarkup from "./pages/signup";

const loginRequest = async (email, password) => {
  return axios.post("/api/users/login", { email, password });
};

const processLocalToken = (token) => {
  let user = {};
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log("You are not logged in");
    } else {
      axios.defaults.headers.common["authorization"] = token;
      user = decodedToken.user;
    }
  }
  return user;
};

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [authenticatedUser, setAuthenticatedUser] = useState({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupForm, setSignupForm] = useState({});

  useEffect(() => {
    const token = localStorage.MERKDZIdToken;
    const user = processLocalToken(token);
    setAuthenticatedUser({ ...user });
    axios("/api/posts")
      .then((result) => {
        setPosts([...result.data.doc]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLogin = () => {
    loginRequest(email, password)
      .then((result) => {
        const newToken = `Bearer ${result.data.token}`;
        localStorage.setItem("MERKDZIdToken", newToken);
        axios.defaults.headers.common["authorization"] = newToken;
        const user = processLocalToken(newToken);
        setAuthenticatedUser({ ...user });
      })
      .catch((err) => console.log(err));
  };

  const onPostClick = () => {
    if (newPost) {
      axios
        .post("/api/posts/post", { body: newPost })
        .then((result) => {
          setNewPost("");
          setPosts([...posts, result.data.doc]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onDeleteClick = (e) => {
    const postToRemove = posts.filter((p, index) => {
      if (index === +e.target.id) return p;
    });
    const postId = postToRemove[0]._id;
    axios
      .delete(`/api/posts/post/${postId}`)
      .then((result) => {
        const indexToRemove = posts.findIndex((p) => {
          return p._id === result.data.doc._id;
        });
        posts.splice(indexToRemove, 1);
        setPosts([...posts]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <div className="App">
        <h3>Merkadz</h3>
        {Object.keys(authenticatedUser).length !== 0 ? (
          <Fragment>
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button onClick={onPostClick}>POST</button>
          </Fragment>
        ) : (
          <LoginMarkup
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        )}
        <SignupMarkup />
        <p>List of posts</p>
        <ul>
          {posts.map((post, index) => {
            return (
              <li key={post._id}>
                {post.body}{" "}
                {Object.keys(authenticatedUser).length !== 0 &&
                  authenticatedUser.handle === post.userHandle && (
                    <button id={index} onClick={onDeleteClick}>
                      Delete
                    </button>
                  )}
              </li>
            );
          })}
        </ul>
      </div>
      <footer style={{ position: "absolute", bottom: 10, width: "100%" }}>
        <p style={{ textAlign: "center" }}>
          Copyright © 2020. Merkadz. All rights reserved.
        </p>
      </footer>
    </Fragment>
  );
}

export default App;
