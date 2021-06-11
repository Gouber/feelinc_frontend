import logo from './logo.svg';
import './App.css';
import All from "./components/All"
import Specific from "./components/Specific";
import Demo from "./components/Demo"
import DemoComponent from "./components/DemoComponent"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/all">All</Link>
            </li>
            <li>
              <Link to="/specific">Specific</Link>
            </li>
            <li>
              <Link to="/demo">Demo</Link>
            </li>
            <li>
              <Link to="/demoComponent">Demo Component</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/all">
            <All />
          </Route>
          <Route path="/specific">
            <Specific />
          </Route>
          <Route path="/demo">
            <Demo />
          </Route>
          <Route path="/demoComponent">
            <DemoComponent />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
