import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      toast.success("Profile details updated");
      if (auth.currentUser.displayName !== name) {
        // update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID,
      );
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  };

  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  return (
    <main>
      <div className="max-w-7xl mx-auto py-12 px-5">
        <section className="mb-10">
          <div className="py-5">
            <h1 className="text-2xl font-semibold uppercase mb-6 flex justify-between items-center border-b border-b-gray-300 pb-2">
              My Profile
              <button
                className="flex items-center text-base border py-2 px-4 hover:bg-gray-100 transition-all ease-in"
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }}
              >
                <FaEdit className="mr-2" />
                {changeDetail ? "Save" : "Edit"}
              </button>
            </h1>

            <div>
              <form>
                <label className="block mb-1">Display name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  disabled={!changeDetail}
                  onChange={onChange}
                  className={`w-full mb-6 px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition ease-in-out ${
                    changeDetail && "bg-red-200 focus:bg-red-200"
                  }`}
                />

                <label className="block mb-1">Email address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  disabled={!changeDetail}
                  className="w-full mb-12 px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                />
                <div className="flex justify-end">
                  <button
                    onClick={onLogout}
                    className="uppercase font-semibold text-sm py-2 px-3 border-2 border-gray-500 bg-white text-clrDark hover:bg-gray-500 hover:text-white transition-all ease-in-out"
                  >
                    Sign out
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <section className="mb-10">
          <div className="py-5">
            <h1 className="text-2xl font-semibold uppercase mb-6 flex justify-between items-center border-b border-b-gray-300 pb-2">
              My Listings
              <button
                className="flex items-center text-base border py-2 px-4 hover:bg-gray-100 transition-all ease-in"
                onClick={() => navigate("/create-listing")}
              >
                <GrAdd className="mr-2" />
                Add
              </button>
            </h1>
            <div>
              {!loading && listings.length === 0 && (
                <p>You currently have no listings.</p>
              )}
              {!loading && listings.length > 0 && (
                <>
                  <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((listing) => (
                      <ListingItem
                        key={listing.id}
                        id={listing.id}
                        listing={listing.data}
                        onDelete={() => onDelete(listing.id)}
                        onEdit={() => onEdit(listing.id)}
                      />
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
