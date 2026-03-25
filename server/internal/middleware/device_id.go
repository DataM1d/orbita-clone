package middleware

import (
	"context"
	"net/http"
)

type contextKey string

const DeviceIDKey contextKey = "device_id"

func DeviceIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		deviceID := r.Header.Get("X-Device-ID")

		if deviceID == "" && r.Method == "POST" {
			http.Error(w, "X-Device-ID header is required for saving", http.StatusBadRequest)
			return
		}

		// Inject the ID into the request context so handlers can use it
		ctx := context.WithValue(r.Context(), DeviceIDKey, deviceID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
