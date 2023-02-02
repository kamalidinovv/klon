import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import ListingItem from "../components/ListingItem";
import { MdDoubleArrow } from "react-icons/md";

const Home = () => {
  // Fetching Offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //Get reference
        const listingsRef = collection(db, "listings");
        //Create the query (the limit or condition of the request)
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(3),
        );
        // Execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Fetching Places for Rent
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //Get reference
        const listingsRef = collection(db, "listings");
        //Create the query (the limit or condition of the request)
        const q = query(
          listingsRef,
          where("offerType", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(3),
        );
        // Execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  // Fetching Places for Sale
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchListings() {
      try {
        //Get reference
        const listingsRef = collection(db, "listings");
        //Create the query (the limit or condition of the request)
        const q = query(
          listingsRef,
          where("offerType", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(3),
        );
        // Execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <main>
      <section
        style={{
          backgroundImage:
            "linear-gradient(to right bottom, rgba(0,0,0,0.2),rgba(0,0,0,0.1)),url(https://www.presello.com/wp-content/uploads/2019/10/upscale-modern-townhouses-facade.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
        className="relative w-full h-[420px] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto h-full grid items-center content-center justify-start gap-4 px-5">
          <div>
            <h2 className="uppercase font-medium tracking-widest text-2xl sm:text-4xl text-clrDark mb-2">
              Invest in your future.
            </h2>
            <h2 className="uppercase font-medium tracking-widest text-2xl sm:text-4xl text-clrDark mb-4">
              Invest in presello.
            </h2>
            <p className="text-gray-100">
              Find your next home in Metro Manila through the most trusted and
              reliable real estate advisors.
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto space-y-12 my-12 px-5">
        {/* OFFER LISTINGS */}
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className="pb-2 mb-6 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-gray-800 text-2xl font-medium tracking-wider capitalize">
                Recent offers
              </h2>
              <Link to={"/offers"}>
                <p className="text-sm font-medium text-gray-500 hover:text-clrGold transition duration-150 ease-in-out">
                  View more <MdDoubleArrow className="inline-block" />
                </p>
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </section>
        )}
        {/* SALE LISTINGS */}
        {saleListings && saleListings.length > 0 && (
          <section>
            <div className="pb-2 mb-6 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-gray-800 text-2xl font-medium tracking-wider capitalize">
                Properties for sale
              </h2>
              <Link to={"/category/sale"}>
                <p className="text-sm font-medium text-gray-500 hover:text-clrGold transition duration-150 ease-in-out">
                  View more <MdDoubleArrow className="inline-block" />
                </p>
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </section>
        )}
        {/* RENT LISTINGS */}
        {rentListings && rentListings.length > 0 && (
          <section>
            <div className="pb-2 mb-6 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-gray-800 text-2xl font-medium tracking-wider capitalize">
                Properties for rent
              </h2>
              <Link to={"/category/rent"}>
                <p className="text-sm font-medium text-gray-500 hover:text-clrGold transition duration-150 ease-in-out">
                  View more <MdDoubleArrow className="inline-block" />
                </p>
              </Link>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};

export default Home;
