import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import {
  FaBed,
  FaShower,
  FaCarAlt,
  FaBorderAll,
  FaRulerCombined,
  FaSign,
  FaHome,
  FaCouch,
  FaCheckCircle,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Contact from "../components/Contact";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";

const Listing = () => {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactOwner, setContactOwner] = useState(false);

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offerType", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(3),
        );

        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    }
    fetchListings();
  }, [params.categoryName]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto px-5 py-12">
        <section className="hidden md:block">
          <div className="grid grid-cols-3 border-b-2 border-b-clrDark mb-5 ">
            <div className="col-span-2 p-2">
              <div className="flex items-center space-x-1">
                <MdLocationOn className="text-lg text-clrDark" />
                <p className="w-full font-semibold text-gray-600 py-1">
                  {listing.address}
                </p>
              </div>
              <h1 className="text-3xl font-medium">{listing.title}</h1>
            </div>
            <div className="col-span-1 p-2 grid items-center content-center gap-y-2">
              <div className="flex items-center justify-end">
                <div className="text-gray-700 font-semibold mr-1">₱</div>
                <div className="text-3xl font-bold">
                  {listing.offer
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                {listing.offerType === "rent" && (
                  <span className="ml-1 text-gray-700 font-semibold">
                    / month
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
        <section>
          <Swiper
            slidesPerView={1}
            navigation
            loop={true}
            pagination={{ type: "progressbar" }}
            effect="fade"
            modules={[EffectFade]}
            autoplay={{ delay: 3000 }}
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative w-full overflow-hidden h-[320px] sm:h-[600px]"
                  style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <section>
          <div className="my-8">
            {/* Heading */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-300">
              <div className="text-gray-500 font-medium">
                <p>Presello ID {params.listingId.slice(-6).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-x-2 text-sm">
                <div className="flex items-center uppercase text-gray-700 font-semibold py-1 px-4 bg-green-200 select-none">
                  <FaSign className="mr-2" />
                  {listing.offerType === "rent" ? "For Rent" : "For Sale"}
                </div>
                <div className="flex items-center uppercase text-gray-700 font-semibold py-1 px-4 bg-orange-200 select-none">
                  <FaHome className="mr-2" />
                  {listing.propertyType}
                </div>
              </div>
            </div>

            <div className="block md:hidden my-5">
              <div className="flex items-center">
                <div className="text-gray-700 font-semibold mr-1">₱</div>
                <div className="text-3xl font-bold">
                  {listing.offer
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                {listing.offerType === "rent" && (
                  <span className="ml-1 text-gray-700 font-semibold">
                    / month
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-medium py-2">{listing.title}</h1>
                <div className="flex items-center space-x-1">
                  <p className="w-full text-sm font-medium text-gray-700 leading-snug">
                    {listing.address}
                  </p>
                </div>
              </div>
            </div>
            {/* DATA */}
            <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4 my-8 text-xs md:text-sm">
              <div>
                <div className="flex items-center justify-center">
                  <FaBed className="text-2xl mr-2" />
                  <span className="block text-xl">{listing.bedrooms}</span>
                </div>
                <div className="text-center uppercase text-gray-700">
                  {+listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <FaShower className="text-2xl mr-2" />
                  <span className="block text-xl">{listing.bathrooms}</span>
                </div>
                <div className="text-center uppercase text-gray-700">
                  {+listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <FaCarAlt className="text-2xl mr-2" />
                  <span className="block text-xl">{listing.carports}</span>
                </div>
                <div className="text-center uppercase text-gray-700">
                  {+listing.carports > 1 ? "Car Parks" : "Car Park"}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <FaBorderAll className="text-2xl mr-2 font-light" />
                  <span className="block text-xl">
                    {" "}
                    {listing.floorArea} m<sup>2</sup>
                  </span>
                </div>
                <div className="text-center uppercase text-gray-700">
                  Floor Area
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <FaRulerCombined className="text-2xl mr-2 font-light" />
                  <span className="block text-xl">
                    {" "}
                    {listing.lotArea} m<sup>2</sup>
                  </span>
                </div>
                <div className="text-center uppercase text-gray-700">
                  Lot Area
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center">
                  <FaCouch className="text-2xl mb-1 font-light" />
                </div>
                <div className="text-center uppercase text-gray-700">
                  {listing.furnishType}
                </div>
              </div>
            </div>
            {/* DESCRIPTION */}
            <div className="mb-8">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700">{listing.description}</p>
            </div>
            {/* FEATURES */}
            <div className="mb-8">
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="grid xs:grid-cols-2 sm:grid-cols-3">
                {listing.features.map((feature, index) => (
                  <li
                    key={index}
                    className="capitalize flex items-center mb-2 text-gray-700"
                  >
                    <FaCheckCircle className="mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* MAP */}
          <div>
            <div className="w-full h-[350px] md:h-[450px] overflow-x-hidden my-8 ">
              <MapContainer
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[listing.geolocation.lat, listing.geolocation.lng]}
                ></Marker>
              </MapContainer>
            </div>
            {listing.userRef !== auth.currentUser?.uid && !contactOwner && (
              <div className="mt-6">
                <button
                  className="px-7 py-3 bg-clrGold text-clrDark text-sm uppercase font-semibold shadow-md hover:bg-clrDark hover:shadow-lg hover:text-clrGold  focus:shadow-lg active:shadow-lg active:text-white transition duration-150 ease-in-out w-full text-center mb-6"
                  onClick={() => setContactOwner(true)}
                >
                  Contact Owner
                </button>
              </div>
            )}
            {contactOwner && (
              <Contact userRef={listing.userRef} listing={listing} />
            )}
          </div>
        </section>
        <section className="my-6">
          <h2 className="font-semibold text-2xl uppercase tracking-wider text-center mb-6">
            Suggested Properties
          </h2>
          {loading ? (
            <Spinner />
          ) : listings && listings.length > 0 ? (
            <>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p>There are no current offers.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Listing;
