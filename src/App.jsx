import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthLayout from "./layout/AuthLayout"
import Login from "./paginas/Login"
import Registrar from "./paginas/Registrar"
import OlvidePassword from "./paginas/OlvidePassword"
import ConfirmarCuenta from "./paginas/ConfirmarCuenta"
import NuevoPassword from "./paginas/NuevoPassword"
import { AuthProvider } from "./context/AuthProvider"
import RutaProtegida from "./layout/RutaProtegida"
import AdministrarPacientes from "./paginas/AdministrarPacientes"
import { PacientesProvider } from "./context/PacientesProvider"
import CambiarPassword from "./paginas/CambiarPassword"
import EditarPerfil from "./paginas/EditarPerfil"
import CitasAdmin from "./paginas/CitasAdmin"
import { CitasProvider } from "./context/CitasProvider"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <PacientesProvider>
          <CitasProvider>
            <Routes>
              <Route path="/" element={<AuthLayout />} >
                <Route index element={<Login />} />
                <Route path="registrar" element={<Registrar />} />
                <Route path="olvide-password" element={<OlvidePassword />} />
                <Route path="olvide-password/:token" element={<NuevoPassword />} />
                <Route path="confirmar/:id" element={<ConfirmarCuenta />} />
              </Route>

              <Route path="/admin" element={<RutaProtegida />} >
                <Route index element={<AdministrarPacientes />} />
                <Route path="citas" element={<CitasAdmin />} />
                <Route path="perfil" element={<EditarPerfil />} />
                <Route path="cambiar-password" element={<CambiarPassword />} />
              </Route>
            </Routes>
          </CitasProvider>
        </PacientesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
