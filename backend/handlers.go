package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

func GetSupportedDevices(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(supportedDevices)
}

func GetConfiguredDevices(w http.ResponseWriter, r *http.Request) {
	configuredDevices.RLock()
	defer configuredDevices.RUnlock()

	devices := make([]ConfiguredDevice, 0, len(configuredDevices.devices))
	for _, d := range configuredDevices.devices {
		devices = append(devices, d)
	}
	json.NewEncoder(w).Encode(devices)
}

func AddConfiguredDevice(w http.ResponseWriter, r *http.Request) {
	var input struct {
		DeviceTypeID     string           `json:"deviceTypeId"`
		ConnectionParams ConnectionParams `json:"connectionParams"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var devType *DeviceType
	for _, d := range supportedDevices {
		if d.ID == input.DeviceTypeID {
			devType = &d
			break
		}
	}
	if devType == nil {
		http.Error(w, "Unknown device type", http.StatusBadRequest)
		return
	}

	id := uuid.New().String()
	device := ConfiguredDevice{
		ID:               id,
		DeviceType:       *devType,
		ConnectionParams: input.ConnectionParams,
		Status:           "unknown",
	}

	configuredDevices.Lock()
	configuredDevices.devices[id] = device
	configuredDevices.Unlock()

	json.NewEncoder(w).Encode(device)
}

func TestDeviceConnection(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	configuredDevices.Lock()
	device, ok := configuredDevices.devices[id]
	if !ok {
		configuredDevices.Unlock()
		http.Error(w, "Device not found", http.StatusNotFound)
		return
	}

	// Симуляция теста связи: случайный успех/ошибка
	rand.Seed(time.Now().UnixNano())
	if rand.Intn(2) == 0 {
		device.Status = "ok"
	} else {
		device.Status = "error"
	}

	configuredDevices.devices[id] = device
	configuredDevices.Unlock()

	json.NewEncoder(w).Encode(map[string]string{"status": device.Status})
}
