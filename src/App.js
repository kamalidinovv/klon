import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import Category from "./pages/Category";
import Listing from "./pages/Listing";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import NotFound from "./pages/NotFound.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="min-h-screen overflow-hidden block relative pt-[70px] sm:pb-80 pb-[650px]">
      <Router>
        <Header />
        <ScrollToTop>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route
              path="/category/:categoryName/:listingId"
              element={<Listing />}
            />
            <Route path="/offers" element={<Offers />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/create-listing" element={<PrivateRoute />}>
              <Route path="/create-listing" element={<CreateListing />} />
            </Route>
            <Route path="/edit-listing" element={<PrivateRoute />}>
              <Route
                path="/edit-listing/:listingId"
                element={<EditListing />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </ScrollToTop>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
