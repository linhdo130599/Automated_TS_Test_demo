import React, { useState } from "react";
import Home from "./Home";
import FileExplorer from "./FileExplorer";
import { Route, Router, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import Upload from "./Upload";
import NavBar from "./NavBar";
import Report from "./Report";
import AppContext from "../contexts/AppContext";

const history = createBrowserHistory();
function App() {
  const [nodes, setNodes] = useState(null);
  const [tsConfigPath, setTsConfigPath] = useState(null);
  const [srcPath, setSrcPath] = useState(null);
  const [rootPath, setRootPath] = useState(null);

  return (
    <React.Fragment>
      <AppContext.Provider
        value={{
          nodes: nodes,
          setNodes: setNodes,
          tsConfigPath: tsConfigPath,
          setTsConfigPath: setTsConfigPath,
          srcPath: srcPath,
          setSrcPath: setSrcPath,
          rootPath: rootPath,
          setRootPath: setRootPath,
        }}
      >
        <NavBar />
        <Router history={history}>
          <Route exact path="/upload" component={Upload} />
          <Route exact path="/playground" component={Home} />
          {/* <Route exact path="/report" component={Report} /> */}
          <Route exact path="/" component={Upload} />
          {/* <Route exact path="/fileExplorer" component={FileExplorer} /> */}
          {/*<Route exact path='/current-weather' component={CurrentWeather}/>*/}
          {/*<Route exact path='/error' component={ErrorDisplay}/>*/}
        </Router>
      </AppContext.Provider>
    </React.Fragment>
  );
}

export default App;
