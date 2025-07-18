import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddDevicePage({ onAddDevice }) {
  const [supportedDevices, setSupportedDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [connectionParams, setConnectionParams] = useState({
    ip: "",
    modbusId: 1,
    baudRate: 9600,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/devices")
      .then((res) => {
        if (!res.ok) throw new Error("Error loading device types");
        return res.json();
      })
      .then((data) => setSupportedDevices(data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load device types");
      });
  }, []);

  const addDevice = () => {
    if (!selectedDeviceId) {
      alert("Select device");
      return;
    }
    if (!connectionParams.ip) {
      alert("Enter IP address");
      return;
    }

    const deviceType = supportedDevices.find((d) => d.id === selectedDeviceId);

    if (!deviceType) {
      alert("The selected device type was not found");
      return;
    }

    const newDevice = {
      id: Date.now().toString(),
      deviceType,
      connectionParams: { ...connectionParams },
      status: "Not verified",
    };

    onAddDevice(newDevice);
    navigate("/");
  };


  return (
    <div className="app-container">
      <h2>Add a new device</h2>

      <label>
        Select device type:{" "}
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          <option value="">-- select --</option>
          {supportedDevices.map((dev) => (
            <option key={dev.id} value={dev.id}>
              {dev.name}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 15 }}>
        <label>
          IP address:{" "}
          <input
            type="text"
            value={connectionParams.ip}
            onChange={(e) =>
              setConnectionParams((prev) => ({ ...prev, ip: e.target.value }))
            }
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Modbus ID:{" "}
          <input
            type="number"
            min={1}
            max={247}
            value={connectionParams.modbusId}
            onChange={(e) =>
              setConnectionParams((prev) => ({
                ...prev,
                modbusId: Number(e.target.value),
              }))
            }
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Speed (baud rate):{" "}
          <input
            type="number"
            value={connectionParams.baudRate}
            onChange={(e) =>
              setConnectionParams((prev) => ({
                ...prev,
                baudRate: Number(e.target.value),
              }))
            }
          />
        </label>
      </div>


      <button className="btn" onClick={addDevice} style={{ marginTop: 20 }}>
        Add device
      </button>
    </div>
  );
}

export default AddDevicePage;



