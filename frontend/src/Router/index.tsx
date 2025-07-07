import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";
import { Login } from "../view/pages/Login";
import { Register } from "../view/pages/Register";
import { AuthLayout } from "../view/layouts/AuthLayout";
import { Home } from "../view/pages/Home";
import { Simulacao } from "../view/pages/Simulacao";
import { Parcelamento } from "../view/pages/Simulacao/Parcelamento";
import { Confirmacao } from "../view/pages/Simulacao/Confirmacao";
import { Emprestimos } from "../view/pages/Emprestimos";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        <Route element={<AuthGuard isPrivate />}>
          <Route path="/" element={<Home />} />
          <Route path="/simulacao" element={<Simulacao />} />
          <Route path="/simulacao/parcelamento" element={<Parcelamento />} />
          <Route path="/simulacao/confirmacao" element={<Confirmacao />} />
          <Route path="/emprestimos" element={<Emprestimos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
