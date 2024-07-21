import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import axios from "axios";
import Navbar from "../components/navbar";

const AvailibiltyPage = () => {
  const [availibilty, setAvailibilty] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailibilty = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}employee/availibilty`,
          { withCredentials: true },
        );
        console.log(response.data);
        setAvailibilty(response.data);
      } catch (err) {
        console.error("Failed to fetch availibilty", err);
      }
    };

    fetchAvailibilty();
  }, []);

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (!date || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}:00Z`);
    const endDateTime = new Date(`${date}T${endTime}:00Z`);

    if ((endDateTime - startDateTime) / (1000 * 60 * 60) < 4) {
      setError("availibilty must be at least four hours daily.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}employee/availibilty`,
        {
          date,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          timezone,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setAvailibilty(response.data.availibilty);
        setDate("");
        setStartTime("");
        setEndTime("");
        setError("");
      }
    } catch (err) {
      console.error("Failed to create availibilty", err);
      setError("Failed to create availibilty");
    }
  };

  return (
    <div className="p-4">
      <Navbar />
      <h2 className="text-2xl py-10 font-semibold text-center mb-4">
        Create availibilty
      </h2>
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700"
          >
            Timezone
          </label>
          <Input
            id="timezone"
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Create availibilty
        </Button>
      </form>
      <h2 className="text-2xl font-semibold text-center mt-8">
        Current availibilty
      </h2>
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time Range</th>
                <th className="px-4 py-2">Timezone</th>
              </tr>
            </thead>
            <tbody>
              {availibilty.map((avail, index) => (
                <tr key={index} className="bg-gray-100">
                  <td className="border px-4 py-2">
                    {new Date(avail.date).toLocaleDateString("en-US", {})}
                  </td>
                  <td className="border px-4 py-2">{avail.date}</td>
                  <td className="border px-4 py-2">
                    {new Date(avail.startTime).toLocaleTimeString("en-US", {})}{" "}
                    - {new Date(avail.endTime).toLocaleTimeString("en-US", {})}
                  </td>
                  <td className="border px-4 py-2">{avail.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AvailibiltyPage;
