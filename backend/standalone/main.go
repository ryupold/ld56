package main

import (
	"log"
	"net/http"
	"os"

	"ryupold/website/loggy"
	ld56 "ryupold/website/ludumdare/ld56/api"
)

func routes() []Route {
	return CombineRoutes(
		[]Route{
			PreventPathToHaveDotDot,
			CheckHoldTheLineList,
			Root,
		},

		ld56.Routes(ld56.APIConfig{
			DBPath:       Config.DataDirectory + "/ludumdare/ld56/db",
			APIPrefix:    "/ludumdare/ld56",
			FrontendPath: ProjectRoot + "/modules/ludumdare/ld56/frontend",
			BackendPath:  ProjectRoot + "/modules/ludumdare/ld56/backend",
		}),
	)
}

func main() {
	loggy.LogDirectory = Config.DataDirectory + "/logs"
	http.HandleFunc("/", Decide(routes()))

	defer Cleanup()

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
