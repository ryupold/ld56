package api

import (
	"ryupold/website/ludumdare/ld56/db"
	"ryupold/website/ludumdare/ld56/website"
)

type APIConfig struct {
	DBPath       string
	APIPrefix    string
	FrontendPath string
	BackendPath  string
}

var Config APIConfig = APIConfig{
	DBPath:       "",
	APIPrefix:    "",
	FrontendPath: "",
	BackendPath:  "",
}

func Routes(config APIConfig) []website.Route {
	Config = config

	db.DBPath = config.DBPath

	return []website.Route{
		PublicAPI(config),
		Root(config),
	}
}
