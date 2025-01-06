import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Layout from "./Layout/Layout";
import { AuthContext } from "./Context/AuthContext";
import { lazy, Suspense, useContext, useState, useEffect } from "react";

const Chat = lazy(() => import("./Chat/Chat"));
const History = lazy(() => import("./History/History"));
const Home = lazy(() => import("./Home/Home"));
const Products = lazy(() => import("./Products/Products"));
const Users = lazy(() => import("./Users/Users"));
const Login = lazy(() => import("./Login/Login"));
const NewProduct = lazy(() => import("./New/NewProduct"));

function App() {
  const { user } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!user || !!localStorage.getItem("id_user")
  );

  useEffect(() => {
    if (user || localStorage.getItem("id_user")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            <Switch>
              <PrivateRoute
                exact
                path="/"
                component={Home}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                exact
                path="/chat"
                component={Chat}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                exact
                path="/users"
                component={Users}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                exact
                path="/products"
                component={Products}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                exact
                path="/history"
                component={History}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                exact
                path="/new"
                component={NewProduct}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                exact
                path="/update/:productId"
                component={NewProduct}
                isAuthenticated={isAuthenticated}
              />

              <Route path="/login" component={Login} />
            </Switch>
          </Layout>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
