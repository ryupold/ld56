package api

import (
	"net/http"
	"strings"

	"ryupold/website"
)

func Root(config APIConfig) func(r *http.Request) (website.MaybeRoute, error) {
	return func(r *http.Request) (website.MaybeRoute, error) {
		path := Path(Config.APIPrefix, r)
		if path == "/" {
			path = "/index.html"
		}

		var isPubPage = path == "/" ||
			path == "/index.html" ||
			(strings.Count(path, "/") == 1 && strings.HasSuffix(path, ".html")) ||
			strings.HasPrefix(path, "/pub/")

		if isPubPage {
			return func(w http.ResponseWriter, req *http.Request) error {
				if err := website.ServeFile(w, r, website.JoinPaths(config.FrontendPath, path), true); err != nil {
					return website.RedirectTo404(w, r, website.JoinPaths(config.FrontendPath, "/pub/error/404.html"), false)
				}
				return nil
			}, nil
		}

		if path == "/favicon.ico" {
			return func(w http.ResponseWriter, req *http.Request) error {
				return website.ServeFile(w, r, website.JoinPaths(config.FrontendPath, "/pub/assets/favicon.ico"), true)
			}, nil
		}
		return nil, nil
	}
}
