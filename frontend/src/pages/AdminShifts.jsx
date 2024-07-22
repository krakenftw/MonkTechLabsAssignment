import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Navbar from "../components/navbar";
import { allTimeZones } from "../lib/timezones";
import { useToast } from "../components/ui/use-toast";

const AdminShifts = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const { toast } = useToast();
  const [availables, setAvailables] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    if (date && startTime && endTime) {
      if (startTime > endTime) {
        toast({
          title: "Invalid Time",
          description: "Start time is greater than end time",
        });
        return;
      }
      const getData = async () => {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}admin/availibilty/time`,
          {
            date,
            startTime: `${startTime}`,
            endTime: `${endTime}`,
          },
          { withCredentials: true },
        );
        setAvailables(response.data.data);
      };
      getData();
    }
  }, [date, startTime, endTime]);

  const handleCreateShift = async () => {
    if (!date || !startTime || !endTime || !selectedEmployee || !timezone) {
      toast({
        variant: "warning",
        title: "Missing Information",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}admin/shifts/create`,
        {
          userId: selectedEmployee,
          date,
          startTime,
          endTime,
          timezone,
        },
        { withCredentials: true },
      );
      toast({
        variant: "success",
        title: "Shift created",
        description: response.data.msg,
      });
    } catch (error) {
      console.error("Error creating shift:", error);
      toast({
        variant: "error",
        title: "Failed to create shift",
        description: error.response.data.msg,
      });
    }
  };

  return (
    <div className="px-4">
      <Navbar />
      <h2 className="text-2xl py-10 font-semibold text-center mb-4">
        Create Shift
      </h2>
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
        <Select id="timezone" value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="w-full">
            <SelectValue>{timezone}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {allTimeZones.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="employee"
          className="block text-sm font-medium text-gray-700"
        >
          Employee
        </label>
        <Select
          id="employee"
          value={selectedEmployee}
          onValueChange={setSelectedEmployee}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an employee" />
          </SelectTrigger>
          <SelectContent>
            {availables.map((employee) => (
              <SelectItem key={employee._id} value={employee._id}>
                {employee.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleCreateShift} className="w-full">
        Create Shift
      </Button>
    </div>
  );
};

export default AdminShifts;
