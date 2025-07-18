package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	r := mux.NewRouter()

	// ваши маршруты
	r.HandleFunc("/devices", GetSupportedDevices).Methods("GET")
	r.HandleFunc("/configured", GetConfiguredDevices).Methods("GET")
	r.HandleFunc("/configured", AddConfiguredDevice).Methods("POST")
	r.HandleFunc("/configured/{id}/test", TestDeviceConnection).Methods("POST")

	// Создаём CORS middleware с настройками по умолчанию
	handler := cors.Default().Handler(r)

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
