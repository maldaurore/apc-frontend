import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { cerrarSesion } = useAuth();

  return (
    <header className="bg-indigo-600 py-10" >
      <div className="container mx-auto flex justify-between flex-col lg:flex-row items-center" >
        <h1 className="font-bold text-2xl text-indigo-200 text-center" >Administrador de <span className="text-white font-black" >Pacientes y Citas</span></h1>

        <nav className="flex flex-col items-center lg:flex-row gap-4 mt-5 lg:mt-0" >
          <Link to="/admin/citas" className="text-white text-sm uppercase" >Citas</Link>
          <Link to="/admin" className="text-white text-sm uppercase" >Pacientes</Link>
          <Link to="/admin/perfil" className="text-white text-sm uppercase" >Perfil</Link>

          <button
            type="button"
            className="text-white text-sm uppercase"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
