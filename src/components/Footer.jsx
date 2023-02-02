import { Link } from "react-router-dom";
import { AiFillFacebook, AiFillYoutube, AiFillInstagram } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-clrDark">
      <div className="max-w-7xl mx-auto py-8 px-5 grid sm:grid-cols-3 gap-10">
        <div>
          <img
            src="https://dvm-vrn.ru/upload/citrus.arealty/add/logo.png"
            alt="logo"
            className="cursor-pointer h-10 mb-8"
          />
          <h2 className="text-xl uppercase font-medium text-white mb-1">
            Invest in your future.
          </h2>
          <h2 className="text-xl uppercase font-medium text-white mb-4">
            Invest in presello.
          </h2>
          <p className="text-sm text-[#eaeaea]">
            Find your next home in Metro Manila through the most trusted and
            reliable real estate advisors.
          </p>
        </div>
        <div className="grid items-start sm:justify-center">
          <h3 className="text-white uppercase tracking-wide mb-2 font-semibold">
            Navigation
          </h3>
          <ul className="text-[#eaeaea] text-sm">
            <li className="py-2 cursor-pointer hover:text-clrGold transition ease-in">
              <Link to="/">Home</Link>
            </li>
            <li className="py-2 cursor-pointer hover:text-clrGold transition ease-in">
              <Link to="/offers">Offers</Link>
            </li>
            <li className="py-2 cursor-pointer hover:text-clrGold transition ease-in">
              <Link to="/category/sale">Buy</Link>
            </li>
            <li className="py-2 cursor-pointer hover:text-clrGold transition ease-in">
              <Link to="/category/rent">Rent</Link>
            </li>
          </ul>
        </div>
        <div className="grid items-start sm:justify-center">
          <h3 className="text-white uppercase tracking-wide font-semibold">
            Social
          </h3>
          <ul className="text-[#eaeaea] text-sm">
            <li className="py-2 cursor-pointer hover:text-clrGold transition ease-in">
              <Link
                to="https://www.facebook.com/PreselloRealtyChannel"
                className="flex items-center"
              >
                <AiFillFacebook className="mr-2 text-lg" />
                Facebook
              </Link>
            </li>
            <li className="py-2 cursor-pointer hover:text-clrGold transition ease-in">
              <Link
                to="https://www.youtube.com/channel/UCxyLwHwz15uVeXpZjsV1Y2A"
                className="flex items-center"
              >
                <AiFillYoutube className="mr-2 text-lg" />
                Youtube
              </Link>
            </li>
            <li className="py-2 cursor-pointer hover:text-clrGold transition ease-in">
              <Link
                to="https://www.instagram.com/presello_official/?hl=en"
                className="flex items-center"
              >
                <AiFillInstagram className="mr-2 text-lg" />
                Instagram
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
