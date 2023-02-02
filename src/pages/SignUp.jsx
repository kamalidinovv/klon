import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import SignUpImage from "../assets/signup.svg";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredential.user;
      const formDataCopy = { name, email, password };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up was successful!");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration");
    }
  };

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
              Sign up
            </h2>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 md:gap-x-6 lg:gap-x-10 py-16 px-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-10 border-b border-b-gray-200 py-3">
              Create an account
            </h1>
            <form onSubmit={onSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md py-8 sm:px-8 px-6">
                <div className="mb-5">
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    required
                    className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-1">Email address</label>
                  <input
                    type="email"
                    value={email}
                    required
                    className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative mb-5">
                  <label className="block mb-1">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {showPassword ? (
                    <AiFillEyeInvisible
                      className="absolute right-3 top-10 text-xl cursor-pointer"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  ) : (
                    <AiFillEye
                      className="absolute right-3 top-10 text-xl cursor-pointer"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  )}
                </div>

                <button
                  className="bg-indigo-600 w-full text-white px-7 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-indigo-800"
                  type="submit"
                >
                  Sign Up
                </button>
                <div className="flex my-5 items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                  <p className="text-center uppercase text-sm text-gray-500 mx-4">
                    OR
                  </p>
                </div>
                <OAuth />
                <div className="mt-6 border-t border-t-gray-300 text-sm sm:text-base">
                  <p className="flex items-center justify-between pt-4">
                    Already have an account?{" "}
                    <Link
                      to="/sign-in"
                      className=" text-indigo-500 font-medium transition ease-in hover:text-indigo-600"
                    >
                      Sign in instead
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div className="hidden md:grid md:items-center">
            <img
              src={SignUpImage}
              alt="Login Illustration"
              className="select-none block"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
