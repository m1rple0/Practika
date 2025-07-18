package main

import (
	"sync"
)

type DeviceType struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	BaudRate     int     `json:"baudRate"`
	BatteryLevel int     `json:"battery_level,omitempty"`
	PowerMeter   int     `json:"power_meter,omitempty"`
	Temperature  float64 `json:"temperature,omitempty"`
}

// Параметры связи устройства
type ConnectionParams struct {
	IP       string `json:"ip"`
	ModbusID int    `json:"modbusId"`
}

type ConfiguredDevice struct {
	ID               string           `json:"id"`
	DeviceType       DeviceType       `json:"deviceType"`
	ConnectionParams ConnectionParams `json:"connectionParams"`
	Status           string           `json:"status"` // "unknown", "ok", "error"
}

var supportedDevices = []DeviceType{
	{ID: "acc", Name: "Battery Huawei", BatteryLevel: 12, Temperature: 20},
	{ID: "acc", Name: "Battery SMA", BatteryLevel: 23, Temperature: 20},
	{ID: "meter", Name: "Network meter", PowerMeter: 1200, Temperature: 20},
	{ID: "inverter", Name: "Inverter SolarEdge", PowerMeter: 1200, Temperature: 20},
}

var configuredDevices = struct {
	sync.RWMutex
	devices map[string]ConfiguredDevice
}{devices: make(map[string]ConfiguredDevice)}
