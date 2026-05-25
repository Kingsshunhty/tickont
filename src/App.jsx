import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./Components/Layout";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppRoutes from "./Routes/Routes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
