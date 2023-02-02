import { Link } from "react-router-dom";
import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineFieldTime } from "react-icons/ai";
import { FaTrash, FaBed, FaShower, FaEdit } from "react-icons/fa";

const ListingItem = ({ listing, id, onEdit, onDelete }) => {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-lg rounded overflow-hidden transition-all">
      <Link className="contents" to={`/category/${listing.offerType}/${id}`}>
        <img
          className="h-[200px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt={listing.title}
        />
        <div className="absolute top-2 left-2 flex items-center bg-gray-500 bg-opacity-75 text-white uppercase text-xs font-semibold rounded-full px-2 py-1 shadow-lg">
          <AiOutlineFieldTime className="mr-1 text-lg" />
          <Moment className="" fromNow>
            {listing.timestamp?.toDate()}
          </Moment>
        </div>

        <div className="w-full p-5">
          {/* PRICE */}
          <div className="flex items-center mb-2">
            <div className="text-gray-700 font-semibold mr-1">$</div>
            <div className="text-2xl font-bold py-1">
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
            {listing.offerType === "rent" && (
              <span className="ml-1 text-gray-700 font-semibold">/ month</span>
            )}
          </div>
          {/* ID NUMBER */}
          <div className="text-sm font-semibold text-gray-700 mb-4">
            Presello ID - {id.slice(-6).toUpperCase()}
          </div>
          {/* TITLE */}
          <p
            className={`${
              listing.title.length < 30 && "h-14"
            } font-medium text-xl mb-2 hover:text-clrGold transition ease-in duration-200`}
          >
            {listing.title}
          </p>
          {/* ADDRESS */}
          <div className="flex items-center space-x-1">
            <MdLocationOn className="text-lg text-clrDark" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          {/* BED/BATH */}
          <div className="flex items-center gap-4 pt-4 max-[350px]:flex-wrap">
            <div className="w-full flex items-center gap-2">
              <FaBed className="text-3xl" />
              <p className="text-sm md:text-base w-full">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </p>
            </div>
            <div className="w-full flex items-center gap-2">
              <FaShower className="text-3xl" />
              <p className="text-sm md:text-base w-full">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      <div className="w-full flex items-center">
        {onEdit && (
          <div
            className="flex items-center justify-center w-full py-2 font-medium  bg-gray-200 hover:bg-clrGold cursor-pointer transition ease-in-out"
            onClick={() => onEdit(listing.id)}
          >
            <FaEdit className="mr-2" />
            Edit
          </div>
        )}
        {onDelete && (
          <div
            className="flex items-center justify-center w-full py-2 font-medium  bg-gray-200 hover:bg-clrGold cursor-pointer transition ease-in-out"
            onClick={() => onDelete(listing.id)}
          >
            <FaTrash className="mr-2" />
            Delete
          </div>
        )}
      </div>
    </li>
  );
};

export default ListingItem;
