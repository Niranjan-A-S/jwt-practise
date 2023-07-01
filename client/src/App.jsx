import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import './App.css';
import { HomePage } from "./pages/home";

export const App = () => {
  return <BrowserRouter>
    <Routes>
      <Route path="/" >
        <Route index element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<HomePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
}