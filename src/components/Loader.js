import ClipLoader from "react-spinners/ClipLoader";
function Loader({loading}) {


return(
<div className="loading-container">
                        {/* This is where the loading spinner will be displayed */}
                        <ClipLoader color={"#123abc"} loading={loading} size={150} />
                        <p>Loading project data...</p>
                    </div>
                    );}
                    export default Loader;

