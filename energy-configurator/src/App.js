import React, { useState } from "react";
import DeviceDashboard from "./DeviceDashboard";
import AddDevicePage from "./AddDevicePage";
import DeviceDetail from "./DeviceDetail";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [devices, setDevices] = useState([
  ]);

  const addDevice = (device) => {
    setDevices((prev) => [...prev, device]);
  };

  const removeDevice = (deviceId) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  // Функция обновления устройства
  const updateDevice = (id, newData) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...newData } : d))
    );
  };

  // Функция для теста соединения
  const testConnection = (deviceId) => {
    alert(`Testing the connection with the device ${deviceId}`);
    // логика теста соединения
  };

  return (
    <Router>
      <nav>
        <Link to="/">Devices</Link> | <Link to="/add">Add</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <DeviceDashboard devices={devices} onRemoveDevice={removeDevice} />
          }
        />
        <Route path="/add" element={<AddDevicePage onAddDevice={addDevice} />} />
        <Route
          path="/device/:id"
          element={
            <DeviceDetail
              devices={devices}
              onRemoveDevice={removeDevice}
              onUpdateDevice={updateDevice}       
              onTestConnection={testConnection}   
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;





