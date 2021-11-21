import MainPage from './pages/mainPage'
import SearchPage from './pages/searchPage';
import ExplorerPage from './pages/explorerPage';
import UserPage from './pages/userPage';
import ItemPage from './pages/item';
import ItemPageNew from './pages/itemNew'
import CompanyPage from './pages/companyPage';
import LoadScreen from './components/loadScreen';
import {ItemPageCinema}  from './pages/itemCinema';
import {ItemPageModal}  from './pages/itemModal';

import './styles/reset.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { UserContext } from './api/userContext';
import { useState } from 'react';
import { Msg } from './components/msg';


function App() {

  const [user, setUser] = useState({
    user:"",
    id : "",
    type:""
  })

  const [load, setLoad] = useState(false)
  const [fade, setFade] = useState("in")

  const [msg, setMsg] = useState({
    text:"",
    color:"green"
  })

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      load,
      setLoad,
      fade,
      setFade,
      msg,
      setMsg,
    }} >
      {load ? <LoadScreen/> : null}
      {msg.text !== "" ? <Msg/> : null}
      <Router>
        <Switch>
          <Route exact path="/" >
            <MainPage />
          </Route>
          <Route path="/search" >
            <SearchPage />
          </Route>
          <Route path="/explore/:text" >
            <ExplorerPage />
          </Route>
          <Route path="/user/:id" >
            <UserPage />
          </Route>
          <Route path="/company/:id" >
            <CompanyPage/>
          </Route>
          {/* ITEMS */}
          <Route path="/itemPage/:id" >
            <ItemPage />
          </Route>
          <Route path="/itemCreate/:id" >
            <ItemPageNew />
          </Route>
          <Route path="/itemPage2" >
            <ItemPageCinema />
          </Route>
          <Route path="/itemPage3" >
            <ItemPageModal />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
