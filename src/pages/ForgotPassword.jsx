import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordImage from "../assets/forgot-password.svg";
import OAuth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
      navigate("/sign-in");
    } catch (error) {
      toast.error("Could not send reset password");
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
              Forgot Password
            </h2>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 md:gap-x-6 lg:gap-x-10 py-16 px-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-10 border-b border-b-gray-200 py-3">
              Reset your password
            </h1>
            <form onSubmit={onSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md py-8 sm:px-8 px-6">
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
                <button
                  className="bg-indigo-600 w-full text-white px-7 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-indigo-800"
                  type="submit"
                >
                  Send reset email
                </button>
                <div className="flex my-5 items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                  <p className="text-center uppercase text-sm text-gray-500 mx-4">
                    OR
                  </p>
                </div>
                <OAuth />
                <div className="mt-8 border-t border-t-gray-300 text-sm sm:text-base">
                  <p className="flex items-center justify-between pt-4">
                    Don't have an account yet?{" "}
                    <Link
                      to="/sign-up"
                      className=" text-indigo-500 font-medium transition ease-in hover:text-indigo-600"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
          <div className="hidden md:grid md:items-center">
            <img
              src={ForgotPasswordImage}
              alt="Forgot Password Illustration"
              className="select-none block"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
