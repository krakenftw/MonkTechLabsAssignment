import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { useUser } from "../context/user";

const EmployeeShifts = () => {
  const { user, loading } = useUser();
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const fetchShifts = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}employee/shifts`,
            { withCredentials: true },
          );
          console.log("Fetched Shifts:", response.data);
          setShifts(response.data);
        } catch (err) {
          console.error("Failed to fetch shifts", err);
          setError("Failed to fetch shifts");
        }
      };

      fetchShifts();
    }
  }, [user]);

  return (
    <div className="px-4">
      <Navbar />
      <h2 className="text-2xl py-10 font-semibold text-center mb-4">
        My Shifts
      </h2>
      {error && <div className="text-red-500">{error}</div>}
      {shifts.length === 0 && !error && (
        <div className="text-center text-gray-500">No shifts available</div>
      )}
      {shifts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">End Time</th>
                <th className="px-4 py-2">Timezone</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift._id} className="bg-gray-100">
                  <td className="border px-4 py-2">{shift.date}</td>
                  <td className="border px-4 py-2">{shift.startTime}</td>
                  <td className="border px-4 py-2">{shift.endTime}</td>
                  <td className="border px-4 py-2">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeShifts;
