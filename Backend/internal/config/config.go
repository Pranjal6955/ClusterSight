package config

import (
	"os"
	"strings"
)

type Config struct {
	PrometheusURL string
	ServerPort    string
	DockerHost    string
	CORSOrigins   []string
}

var cfg *Config

func init() {
	corsOrigins := getEnv("CORS_ORIGINS", "http://localhost:3000,http://frontend:3000")

	cfg = &Config{
		PrometheusURL: getEnv("PROMETHEUS_URL", "http://localhost:9090"),
		ServerPort:    getEnv("SERVER_PORT", "8081"),
		DockerHost:    getEnv("DOCKER_HOST", "unix:///var/run/docker.sock"),
		CORSOrigins:   strings.Split(corsOrigins, ","),
	}
}

func GetConfig() *Config {
	return cfg
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
