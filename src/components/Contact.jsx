import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Contact = ({ userRef, listing }) => {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOwner(docSnap.data());
      } else {
        toast.error("Could not get owner's data");
      }
    };
    getOwner();
  }, [userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {owner !== null && (
        <div className="flex flex-col w-full">
          <p className="text-gray-700">
            Send a message to{" "}
            <span className="capitalize font-medium text-clrDark">
              {owner.name}
            </span>{" "}
            to inquire for the{" "}
            <span className="capitalize font-medium text-clrDark">
              {listing.title}
            </span>
            :
          </p>
          <div>
            <textarea
              name="message"
              id="message"
              rows="5"
              value={message}
              onChange={onChange}
              placeholder="Message"
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mt-3 mb-6"
            ></textarea>
          </div>
          <a
            href={`mailto:${owner.email}?Subject=${listing.title}&body=${message}`}
          >
            <button
              type="button"
              className="px-7 py-3 bg-clrGold text-clrDark text-sm uppercase font-semibold shadow-md hover:bg-clrDark hover:shadow-lg hover:text-clrGold  focus:shadow-lg active:shadow-lg active:text-white transition duration-150 ease-in-out w-full text-center mb-6"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
