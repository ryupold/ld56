package main

import (
	"errors"
	"net/http"
	"ryupold/website/loggy"
	"strings"
)

var ErrUnauthorized = errors.New("one does not simply walk into the secret area")

var cleanups = make([]func() error, 0)

func AddCleanup(f func() error) {
	cleanups = append(cleanups, f)
}

func Cleanup() {
	for _, clean := range cleanups {
		err := clean()
		if err != nil {
			loggy.Errorf("Error cleaning up: %s", err)
		}
	}
}

func Root(r *http.Request) (MaybeRoute, error) {
	var isMainPage = r.URL.Path == "/" ||
		r.URL.Path == "/index.html" ||
		strings.HasPrefix(r.URL.Path, "/main/")

	if isMainPage {
		return func(w http.ResponseWriter, req *http.Request) error {
			if req.URL.Path == "/" {
				req.URL.Path = "/index.html"
			}

			return ServeFile(w, req, JoinPaths(Config.FrontendPath, req.URL.Path), true)
		}, nil
	}

	if r.URL.Path == "/favicon.ico" {
		return func(w http.ResponseWriter, req *http.Request) error {
			return serveFavicon(w, req)
		}, nil
	}
	return nil, nil
}

func serveFavicon(w http.ResponseWriter, req *http.Request) error {
	return ServeFile(w, req, JoinPaths(Config.FrontendPath, "/main/assets/_favicon.ico"), false)
}
