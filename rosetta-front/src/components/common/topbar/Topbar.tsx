import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MdClose, MdMenu, MdOutlineNotificationsNone } from "react-icons/md";
import { Container, Image, Button } from "../../index";

import logoRosetta from "../../../assets/images/logos/logo_rosetta.svg";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type TopbarProps = {
  nonAuth?: boolean;
  handleLogin?: () => void;
};

export function Topbar({
  nonAuth,
  handleLogin = () => null 
}: TopbarProps) {
  const { avatar } = useContext(UserContext)
  const navigate = useNavigate();
  return (
    <Disclosure
      as="nav"
      className="border-b-2 border-gray-100 md:justify-start bg-default"
    >
      <>
        {nonAuth ? (
          <Container className="flex w-full justify-between items-center h-14 max-w-7xl mx-auto">
            <Image src={logoRosetta} alt="logo-rosetta" className="mx-8 h-8" />

            <Container className="flex min-h-full items-center justify-center">
              <Button
                onClick={() => navigate("/cadastro")}
                className="border-white"
              >
                Cadastrar
              </Button>

              <Button
                append="mx-8"
                className="bg-secundary bg-secundary-hover"
                onClick={handleLogin}
              >
                Entrar
              </Button>
            </Container>
          </Container>
        ) : (
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
                <div className="flex flex-shrink-0">
                  <Link to={"/perfil"}>
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </Link>
                </div>  
                <div className="hidden sm:block mx-auto">
                  <div className="flex space-x-4 w-full">
                    <Link to={"/pedidos"} className="p-2 rounded text-white bg-primary-500">
                        Meus Pedidos
                    </Link>
                    <Link to={"/pedidos/novo"} className="p-2 rounded text-white bg-primary-500">
                        Criar Pedidos
                    </Link>
                  
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <MdOutlineNotificationsNone
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button
                      onClick={() => navigate("/perfil/editar")}
                      className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={avatar ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  
                </Menu>
              </div>
            </div>
          </div>
        )}
      </>
      {/* </div> */}
    </Disclosure>
  );
}
