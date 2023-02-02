import { AiFillFacebook, AiFillYoutube, AiFillInstagram } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, setIsOpen, pageState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };
  return (
    <div
      className={`fixed w-60 top-0 right-0 bottom-0 bg-clrDark h-full text-white z-50 translate-x-60 transition-all duration-300 ease-in-out ${
        isOpen && "translate-x-0"
      }`}
    >
      <div className="flex items-center justify-end my-5 mx-6">
        {/* Close menu button*/}
        <button className="inline-flex items-center justify-center rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
          <span className="sr-only">Close Sidebar</span>
          <XMarkIcon
            className="block h-8 w-8"
            onClick={() => setIsOpen(false)}
          />
        </button>
      </div>
      <div className="m-8">
        <nav className="mb-10">
          <div className="flex flex-col ">
            <Link
              to="/"
              className={`uppercase font-semibold text-sm py-[10px] px-[5px] mb-4 hover:text-clrGold transition-all ease-in-out duration-200 ${
                pathMatchRoute("/") && "text-white "
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/category/sale"
              className={`uppercase font-semibold text-sm py-[10px] px-[5px] mb-4 hover:text-clrGold transition-all ease-in-out duration-200 ${
                pathMatchRoute("/category/sale") && "text-white "
              }`}
              onClick={() => setIsOpen(false)}
            >
              Buy
            </Link>
            <Link
              to="/category/rent"
              className={`uppercase font-semibold text-sm py-[10px] px-[5px] mb-4 hover:text-clrGold transition-all ease-in-out duration-200 ${
                pathMatchRoute("/category/rent") && "text-white "
              }`}
              onClick={() => setIsOpen(false)}
            >
              Rent
            </Link>

            <Link
              to="/offers"
              className={`uppercase font-semibold text-sm py-[10px] px-[5px] mb-4 hover:text-clrGold transition-all ease-in-out duration-200 ${
                pathMatchRoute("/offers") && "text-white "
              }`}
              onClick={() => setIsOpen(false)}
            >
              Offers
            </Link>
            <Link
              to="/profile"
              className={`uppercase font-semibold text-sm py-[10px] px-[5px] mb-4  hover:text-clrGold transition-all ease-in-out duration-200  ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "text-white "
              }`}
              onClick={() => setIsOpen(false)}
            >
              {pageState}
            </Link>
          </div>
        </nav>
        <div className="flex flex-col justify-center items-center gap-10">
          <div>
            <img
              src="https://www.presello.com/wp-content/uploads/2019/10/presello-logo-text.png"
              alt="logo"
              className="cursor-pointer h-6"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.youtube.com/channel/UCxyLwHwz15uVeXpZjsV1Y2A"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillYoutube className="w-6 h-6 hover:text-clrGold transition ease-in" />
            </a>
            <a
              href="https://www.facebook.com/PreselloRealtyChannel"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillFacebook className="w-6 h-6 hover:text-clrGold transition ease-in" />
            </a>
            <a
              href="https://www.instagram.com/presello_official/?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillInstagram className="w-6 h-6 hover:text-clrGold transition ease-in" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
