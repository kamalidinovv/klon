import { ImSpinner2 } from "react-icons/im";

const Spinner = () => {
  return (
    <div className="bg-black bg-opacity-20 flex items-center justify-center fixed inset-0 z-50">
      <div>
        <ImSpinner2 className="text-8xl animate-spin text-clrGold" />
      </div>
    </div>
  );
};

export default Spinner;
