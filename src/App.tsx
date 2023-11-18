import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";

export const App = () => {
  const { session } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home session={session} />} />
        <Route path={"/signin"} element={<Signin />} />
        <Route path={"/signup"} element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};
