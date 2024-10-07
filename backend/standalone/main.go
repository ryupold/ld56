package main

import (
	"log"
	"net/http"
	"os"

	"ryupold/website/loggy"
	ld56 "ryupold/website/ludumdare/ld56/api"
	"ryupold/website/ludumdare/ld56/website"
)

func routes() []website.Route {
	return website.CombineRoutes(
		[]website.Route{
			website.PreventPathToHaveDotDot,
			website.CheckHoldTheLineList,
			website.Root,
		},

		ld56.Routes(ld56.APIConfig{
			DBPath:       website.Config.DataDirectory + "/ludumdare/ld56/db",
			APIPrefix:    "/ludumdare/ld56",
			FrontendPath: website.ProjectRoot + "/modules/ludumdare/ld56/frontend",
			BackendPath:  website.ProjectRoot + "/modules/ludumdare/ld56/backend",
		}),
	)
}

func main() {
	loggy.LogDirectory = website.Config.DataDirectory + "/logs"
	http.HandleFunc("/", website.Decide(routes()))

	defer website.Cleanup()

	if len(os.Args) > 1 && os.Args[1] == "debug" {
		log.Default().Println("start in debug mode")
		err := http.ListenAndServe(":3000", nil)
		if err != nil {
			log.Fatal("ListenAndServe:3000 ", err)
		}
	} else {
		log.Default().Println("start in release mode")
		err := http.ListenAndServe(":80", nil)
		if err != nil {
			log.Fatal("ListenAndServe:80 ", err)
		}
	}
}
