import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Details from "./components/details";
import Login from "./components/login";
import Signup from "./components/signup";
import Template1 from "./templates/template1";
import Template2 from "./templates/template2";
import Template3 from "./templates/template3";
import Template4 from "./templates/template4";
import Template5 from "./templates/template5";
import Template6 from "./templates/template6";
import TemplateDisplay from "./components/templateDisplay";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedLayout from "./components/authenticatedLayout"; // Corrected casing for consistency
import PublicTemplateWrapper from "./components/publicTemplateWrapper"; // Import the new wrapper

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* New public route for hosted templates */}
          <Route path="/public-template/:id/:userId" element={<PublicTemplateWrapper />} />

          {/* Protected Routes - All nested under AuthenticatedLayout */}
          {/* The AuthenticatedLayout renders the Navbar, and then the specific child route content */}
          <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/details" element={<Details />} />
            <Route path="/templates" element={<TemplateDisplay />} />
            <Route path="/template/1" element={<Template1 />} />
            <Route path="/template/2" element={<Template2 />} />
            <Route path="/template/3" element={<Template3 />} />
            <Route path="/template/4" element={<Template4 />} />
            <Route path="/template/5" element={<Template5 />} />
            <Route path="/template/6" element={<Template6 />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
