import React from "react";
import { useNavigate } from "react-router-dom";

function DeviceDashboard({ devices, onRemoveDevice }) {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1>Device list</h1>
      <div className="card-grid">
        {devices.map((device) => (
          <div
            key={device.id}
            className="device-card"
            tabIndex={0}
            onClick={() => navigate(`/device/${device.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/device/${device.id}`);
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3>{device.deviceType.name}</h3>
                <p>
                  IP: {device.connectionParams.ip} | Modbus ID:{" "}
                  {device.connectionParams.modbusId}
                </p>
                <p>
                  Статус:{" "}
                  <span
                    className={
                      device.status === "OK"
                        ? "status-ok"
                        : device.status === "Ошибка"
                        ? "status-error"
                        : "status-unknown"
                    }
                  >
                    {device.status}
                  </span>
                </p>
              </div>
              <button
                className="btn btn-delete"
                onClick={(e) => {
                  e.stopPropagation(); // чтобы не срабатывал переход по карточке
                  if (
                    window.confirm(
                      `Remove device "${device.deviceType.name}"?`
                    )
                  ) {
                    onRemoveDevice(device.id);
                  }
                }}
                aria-label={`Remove device ${device.deviceType.name}`}
              >
                &#10005;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceDashboard;

