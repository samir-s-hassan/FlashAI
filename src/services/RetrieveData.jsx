import { useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const RetreiveData = ({ input }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Trying");
    const apiUrl = "https://igojsrmb51.execute-api.us-west-2.amazonaws.com/dev";
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(apiUrl, {
          params: { input },
        });
        console.log(response);
        setData(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <h2>Flashcards Preview</h2>
          {data}
        </div>
      )}
    </div>
  );
};

export default RetreiveData;
