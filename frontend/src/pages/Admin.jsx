import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert } from "../components/ui/alert";
import axios from "axios";
import Navbar from "../components/navbar";
import { useUser } from "../context/user";
import { useNavigate } from "react-router-dom";

const AdminavailibiltyPage = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [availibilty, setAvailibilty] = useState([]);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}admin/users`,
          { withCredentials: true },
        );
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
        setError("Failed to fetch employees");
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const fetchavailibilty = async () => {
        setLoadingData(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}admin/availibilty/${
              selectedEmployee._id
            }?timezone=${timezone}`,
            { withCredentials: true },
          );
          setAvailibilty(response.data);
        } catch (err) {
          console.error("Failed to fetch availibilty", err);
        }
        setLoadingData(false);
      };

      fetchavailibilty();
    }
  }, [selectedEmployee, timezone]);

  const handleTimezoneChange = async (e) => {
    setTimezone(e.target.value);
  };

  return (
    <div className="px-4">
      <Navbar />
      <h2 className="text-2xl py-10 font-semibold text-center mb-4">
        View Employee availibilty
      </h2>
      {error && <Alert type="error">{error}</Alert>}
      <div className="mb-4">
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-[180px]">
            <SelectValue aria-label={selectedEmployee} placeholder="employee">
              {selectedEmployee.username}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee._id} value={employee}>
                {employee.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="timezone"
          className="block text-sm font-medium text-gray-700"
        >
          Timezone
        </label>
        <Select
          id="timezone"
          value={timezone}
          onValueChange={handleTimezoneChange}
        >
          <SelectContent>
            {" "}
            <SelectItem value="UTC">UTC</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        <div className="overflow-x-auto">
          {!loadingData ? (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time Range (Employee Timezone)</th>
                  <th className="px-4 py-2">Timezone</th>
                </tr>
              </thead>
              <tbody>
                {availibilty.map((avail, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="border px-4 py-2">
                      {new Date(avail.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </td>
                    <td className="border px-4 py-2">{avail.date}</td>
                    <td className="border px-4 py-2">
                      {new Date(avail.startTime).toLocaleTimeString("en-US", {
                        timeZone: avail.timezone,
                      })}{" "}
                      - {new Date(avail.endTime).toLocaleTimeString()}
                    </td>
                    <td className="border px-4 py-2">{avail.timezone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminavailibiltyPage;
