import { useState, useRef } from "react";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

const CreateListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const [formData, setFormData] = useState({
    offerType: "sale",
    propertyType: "townhouse",
    title: "",
    furnishType: "furnished",
    floorArea: 1,
    lotArea: 1,
    bedrooms: 1,
    bathrooms: 1,
    carports: 0,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    offerType,
    propertyType,
    title,
    furnishType,
    floorArea,
    lotArea,
    bedrooms,
    bathrooms,
    carports,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const featInput = useRef(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const feat = newFeature.trim();

    if (feat && !features.includes(feat)) {
      setFeatures((prevFeatures) => [...prevFeatures, feat]);
    }
    setNewFeature("");
    featInput.current.focus();
  };

  const clearFeatures = (e) => {
    e.preventDefault();
    setNewFeature("");
    setFeatures([]);
    featInput.current.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 images are allowed");
      return;
    }

    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`,
      );
      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error("Please enter a valid address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          },
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image)),
    ).catch((error) => {
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      features,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.offerType}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  return (
    <main>
      <section>
        <div className="max-w-3xl mx-auto py-16 px-5">
          <div className="mb-6">
            <button
              className="flex items-center text-base border py-2 px-4 hover:bg-gray-100 transition-all ease-in"
              onClick={() => navigate("/profile")}
            >
              <BiArrowBack className="mr-2" />
              Back to Profile
            </button>
          </div>
          <h1 className="text-2xl mb-6 font-semibold pb-4 border-b border-b-gray-200">
            Create a Listing
          </h1>
          <form onSubmit={onSubmit}>
            {/* Offer Type */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Offer Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-x-4">
                <button
                  type="button"
                  id="offerType"
                  value="sale"
                  onClick={onChange}
                  className={`w-full px-6 py-3 font-medium text-sm uppercase border border-slate-600 transition-all ease-in-out ${
                    offerType === "rent"
                      ? "bg-white text-black"
                      : "bg-slate-600 text-white"
                  }`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  id="offerType"
                  value="rent"
                  onClick={onChange}
                  className={`w-full px-6 py-3 font-medium text-sm uppercase border border-slate-600 transition-all ease-in-out ${
                    offerType === "sale"
                      ? "bg-white text-black"
                      : "bg-slate-600 text-white"
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>
            {/* Property Type */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                id="propertyType"
                value={propertyType}
                onChange={onChange}
                className="w-full"
              >
                <option value="Condominium">Condominium</option>
                <option value="Apartment">Apartment</option>
                <option value="House and Lot">House and Lot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            {/* Title */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={onChange}
                  maxLength="80"
                  minLength="10"
                  required
                  className="w-full mb-2"
                />
                {title.length > 0 && (
                  <AiOutlineClose
                    className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                    onClick={() =>
                      setFormData((prevState) => ({
                        ...prevState,
                        title: "",
                      }))
                    }
                  />
                )}
              </div>
              <p className="text-right text-xs  text-gray-500">{`${
                80 - title.length
              } character(s)`}</p>
            </div>
            {/* Address */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                maxLength="85"
                value={address}
                onChange={onChange}
                required
                className="w-full mb-2"
              />
              <p className="text-right text-xs text-gray-500">{`${
                85 - address.length
              } character(s)`}</p>
            </div>
            {/* Description */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={onChange}
                maxLength="4000"
                required
                className="w-full h-48"
              />
              <p className="text-right text-xs text-gray-500">{`${
                4000 - description.length
              } character(s)`}</p>
            </div>
            {/* Floor/Lot Area */}
            <div className="mb-6 flex items-center gap-x-4 gap-y-6 max-[400px]:flex-col">
              <div className="w-full">
                <label className="block mb-1 font-medium">
                  Floor Area (m<sup>2</sup>){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="floorArea"
                  min="0"
                  value={floorArea}
                  onChange={onChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 font-medium">
                  Lot Area (m<sup>2</sup>){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="lotArea"
                  min="0"
                  value={lotArea}
                  onChange={onChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 font-medium">
                  Furnishing <span className="text-red-500">*</span>
                </label>
                <select
                  id="furnishType"
                  value={furnishType}
                  onChange={onChange}
                  className="w-full"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>
            {/* Bed-Bath-Carports */}
            <div className="mb-6 flex items-center gap-x-4 gap-y-6 max-[400px]:flex-col">
              <div className="w-full">
                <label className="block mb-1 font-medium">
                  Bedrooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  value={bedrooms}
                  onChange={onChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 font-medium">
                  Bathrooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  value={bathrooms}
                  onChange={onChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 font-medium">
                  Carports <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="carports"
                  min="0"
                  value={carports}
                  onChange={onChange}
                  required
                  className="w-full"
                />
              </div>
            </div>
            {/* Features */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Features <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-x-1 mb-2">
                <input
                  type="text"
                  id="newFeature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  ref={featInput}
                  className="w-full flex-1"
                />
                <button
                  className="inline-flex border border-blue-500 py-2 px-4 bg-blue-500 text-white hover:bg-blue-600
                  active:bg-blue-700 transition-all ease-in-out"
                  onClick={handleAdd}
                >
                  Add
                </button>
                <button
                  className="inline-flex border border-gray-500 py-2 px-4 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-all ease-in-out"
                  onClick={clearFeatures}
                >
                  Clear
                </button>
              </div>
              <p className="text-xs text-left mb-2 text-gray-500">
                Example: Staff Quarters, Drivers, Swimming Pool, CCTV, Electric
                Fence, Etc.
              </p>
              <p className="text-sm">
                Current Features:{" "}
                {features.map((i) => (
                  <em key={i} className="capitalize">
                    {i},{" "}
                  </em>
                ))}
              </p>
            </div>
            {/* Offer */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Offer <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-x-4">
                <button
                  type="button"
                  id="offer"
                  value={true}
                  onClick={onChange}
                  className={`w-full px-6 py-3 font-medium text-sm uppercase border border-slate-600 transition-all ease-in-out ${
                    !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  id="offer"
                  value={false}
                  onClick={onChange}
                  className={`w-full px-6 py-3 font-medium text-sm uppercase border border-slate-600 transition-all ease-in-out ${
                    offer ? "bg-white text-black" : "bg-slate-600 text-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            {/* Regular Price */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Regular Price <span className="text-red-500">*</span>
              </label>
              <div className="flex w-full justify-center items-center gap-x-4">
                <div className="relative w-full">
                  <span className="absolute top-1/2 left-5 -translate-y-1/2 pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    id="regularPrice"
                    value={regularPrice}
                    onChange={onChange}
                    min={0}
                    required
                    className="w-full pl-12"
                  />
                </div>
                {offerType === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap">
                      $ / month
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Discounted Price */}
            {offer && (
              <div className="mb-6">
                <label className="block mb-1 font-medium">
                  Discounted Price <span className="text-red-500">*</span>
                </label>
                <div className="flex w-full justify-center items-center gap-x-4">
                  <div className="relative w-full">
                    <span className="absolute top-1/2 left-5 -translate-y-1/2 pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      id="discountedPrice"
                      value={discountedPrice}
                      onChange={onChange}
                      min={0}
                      required
                      className="w-full pl-12"
                    />
                  </div>
                  {offerType === "rent" && (
                    <div>
                      <p className="text-md w-full whitespace-nowrap">
                        $ / month
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Images */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Upload Pictures <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="images"
                onChange={onChange}
                accept=".jpg,.png,.jpeg"
                multiple
                required
                className="p-0 w-full cursor-pointer file:py-2 file:px-3 file:border-y-0 file:mr-3 file:border-l-0 file:border-r file:bg-clrDark file:text-white form-input"
              />
              <p className="mt-2 text-xs text-gray-500" id="file_input_help">
                JPEG, PNG or JPG (MAX. 6). First image will be the cover image.
              </p>
            </div>
            <button
              type="submit"
              className="uppercase font-semibold py-2 px-6 border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition-all ease-in-out"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CreateListing;
