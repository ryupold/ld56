package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

func PreventPathToHaveDotDot(r *http.Request) (MaybeRoute, error) {
	if strings.Contains(r.URL.Path, "../") {
		return func(w http.ResponseWriter, req *http.Request) error {
			return SlowDown(20*time.Second, Serve404)(w, req)
		}, nil
	}

	return nil, nil
}

// check if it is an attack and slow it down
func CheckHoldTheLineList(r *http.Request) (MaybeRoute, error) {
	for _, v := range holdTheLineList {
		if r.URL.Path == v {
			slowDownTime := time.Duration(rand.Intn(20)) * time.Second
			fmt.Printf("slow down by (%s) then redirect to 404.html %s?%s\n", slowDownTime, r.URL.Path, r.URL.RawQuery)
			<-time.After(slowDownTime)
			return Serve404, nil
		}
	}
	return nil, nil
}

func Serve404(w http.ResponseWriter, req *http.Request) error {
	w.WriteHeader(404)

	return ServeFile(w, req, JoinPaths(Config.FrontendPath, "/main/errors/404.html"), true)
}
