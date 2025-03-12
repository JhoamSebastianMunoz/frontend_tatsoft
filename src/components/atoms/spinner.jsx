import { BallTriangle } from "react-loader-spinner";

function MiComponente() {
  return (
    <div className="flex justify-center items-center h-screen">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#842AF3"
        ariaLabel="ball-triangle-loading"
        wrapperClass=""
        wrapperStyle=""
        visible={true}
      />
    </div>
  );
}

export default MiComponente;