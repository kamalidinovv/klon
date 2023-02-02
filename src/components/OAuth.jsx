import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { db } from "../firebase";
import { toast } from "react-toastify";

const OAuth = () => {
  const navigate = useNavigate();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //Check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center bg-gray-100 active:bg-gray-200 w-full px-7 py-3 rounded-lg font-medium shadow-md transition duration-150 ease-in-out hover:shadow-lg"
    >
      <FcGoogle className="text-xl rounded-full mr-3" />
      Continue with Google
    </button>
  );
};

export default OAuth;
