import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(6),
        );
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

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
  }, []);

  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(3),
      );
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  }

  return (
    <main>
      <section
        style={{
          backgroundImage:
            "linear-gradient(to right bottom, rgba(0,0,0,0.4),rgba(0,0,0,0.2)),url(https://www.presello.com/wp-content/uploads/2019/10/upscale-modern-townhouses-facade.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="relative w-full h-[420px] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto h-full grid items-center content-center justify-center text-center md:justify-start gap-4 px-5">
          <div>
            <h2 className="uppercase font-medium tracking-widest text-3xl md:text-4xl text-gray-100 mb-2">
              OFFERS
            </h2>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto my-12">
        {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>

            {lastFetchedListing && (
              <div className="flex justify-center items-center my-14">
                <button
                  className="bg-white px-4 py-2 text-gray-700 border border-gray-300 rounded hover:border-slate-600 transition duration-150 ease-in-out"
                  onClick={onFetchMoreListings}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        ) : (
          <p>There are no current offers.</p>
        )}
      </section>
    </main>
  );
};

export default Offers;
