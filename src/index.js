import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts

import Admin from "layouts/Admin";
import Auth from "layouts/Auth";

// Components

import IndexNavbar from "components/Navbars/IndexNavbar";
import Footer from "components/Footers/Footer"

// views without layouts

import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js"; 
import SudokuGame from "views/sudoku/Game";
import SecretFriend from "views/secretfriend/SecretFriend";
import SecretFriendCreate from "views/secretfriend/SecretFriendCreate";


ReactDOM.render(
  <HashRouter basename="/">
    <IndexNavbar fixed />
    <Switch>
      {/* add routes with layouts */}
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />
      {/* add routes without layouts */}
      <Route path="/landing" exact component={Landing} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/project/sudoku" exact component={SudokuGame} />
      <Route path="/project/secret-friend/:code" exact component={SecretFriend} />
      <Route path="/project/secret-friend" exact component={SecretFriendCreate} />
      <Route path="/" exact component={Index} />
      {/* add redirect for first page */}
      <Redirect from="*" to="/" />
    </Switch>
    <Footer />
  </HashRouter>,
  document.getElementById("root")
);
