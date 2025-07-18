import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function DeviceDetail({ devices, onUpdateDevice, onTestConnection }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const device = devices.find((d) => d.id === id);
  const temperatureToShow = device.deviceType?.temperature ?? "N/A";

  useEffect(() => {
    if (!device) {
      // Например, редирект на главную
      navigate("/", { replace: true });
    }
  }, [device, navigate]);

  const [connectionParams, setConnectionParams] = useState({
    ip: "",
    modbusId: "",
    baudRate: "",
  });

  useEffect(() => {
    if (device) {
      setConnectionParams({
        ip: device.connectionParams.ip,
        modbusId: device.connectionParams.modbusId,
        baudRate: device.connectionParams.baudRate,
      });
    }
  }, [device]);

  if (!device) return null;

  const onChangeField = (field, value) => {
    setConnectionParams((prev) => ({ ...prev, [field]: value }));
  };

  const onSave = () => {
    onUpdateDevice(device.id, { connectionParams });
    alert("Settings saved");
  };


  return (
    <div className="app-container">
      <h2>Device: {device.deviceType.name}</h2>
      <p>
        <b>Device ID:</b> {device.id}
      </p>

      <div className="connection-params">
        <label>
          IP address:{" "}
          <input
            type="text"
            value={connectionParams.ip}
            onChange={(e) => onChangeField("ip", e.target.value)}
          />
        </label>
        <br />
        <label>
          Modbus ID:{" "}
          <input
            type="number"
            value={connectionParams.modbusId}
            onChange={(e) => onChangeField("modbusId", Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Speed (baud rate):{" "}
          <input
            type="number"
            value={connectionParams.baudRate}
            onChange={(e) => onChangeField("baudRate", Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Temperature: <b>{temperatureToShow} °C</b>
        </label>
      </div>
      
      <button className="btn" onClick={onSave} style={{ marginTop: 10 }}>
        Save settings
      </button>

      <div style={{ marginTop: 20 }}>
        <b>Communication status:</b>{" "}
        <span
          style={{
            color:
              device.status === "OK"
                ? "green"
                : device.status === "Error"
                ? "red"
                : "gray",
            fontWeight: "bold",
          }}
        >
          {device.status}
        </span>
      </div>

      <button
        className="btn"
        onClick={() => onTestConnection(device.id)}
        style={{ marginTop: 15 }}
      >
        Check connection
      </button>

      <div style={{ marginTop: 30 }}>
        <Link to="/">← Back to list</Link>
      </div>
    </div>
  );
  

}

export default DeviceDetail;
