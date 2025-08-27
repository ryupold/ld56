package api

import (
	"ryupold/website/ludumdare/ld56/db"
	"ryupold/website/ludumdare/ld56/loggy"
	"ryupold/website/ludumdare/ld56/website"
)

type ModuleConfig struct {
	DBPath       string
	Prefix       string
	FrontendPath string
	BackendPath  string
	LogDirectory string
}

var Config ModuleConfig = ModuleConfig{
	DBPath:       "",
	Prefix:       "",
	FrontendPath: "",
	BackendPath:  "",
	LogDirectory: "",
}

func Routes(config ModuleConfig) []website.Route {
	Config = config

	db.DBPath = config.DBPath
	loggy.LogDirectory = config.LogDirectory

	return []website.Route{
		PublicAPI(config),
		Root(config),
	}
}
