package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type APIConfig struct {
	FrontendPath  string
	BackendPath   string
	ModulesPath   string
	DataDirectory string
}

var ProjectRoot = (func() string {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exPath := filepath.Dir(ex)
	exPath = strings.TrimSuffix(strings.TrimSuffix(exPath, "/cmd"), "\\cmd")
	exPath = strings.TrimSuffix(strings.TrimSuffix(exPath, "/backend"), "\\backend")
	return exPath
})()

var Config = APIConfig{
	FrontendPath:  ProjectRoot + "/frontend",
	BackendPath:   ProjectRoot + "/backend",
	DataDirectory: ProjectRoot + "/backend/data",
	ModulesPath:   ProjectRoot + "/modules",
}

func PathMatchesPrefix(r *http.Request, apiPrefix string) bool {
	return r.URL.Path == apiPrefix || strings.HasPrefix(r.URL.Path, apiPrefix+"/")
}

// root: /
// api: /foo
// none:
func TrimAPIPrefix(r *http.Request, apiPrefix string) string {
	if PathMatchesPrefix(r, apiPrefix) {
		return strings.Replace(r.URL.Path, apiPrefix, "", 1)
	}
	return ""
}

func JoinPaths(basePath string, paths ...string) string {
	result := basePath
	for _, p := range paths {
		result = joinPath(result, p)
	}
	return result
}

func joinPath(basePath, subPath string) string {
	if subPath == "/" {
		return basePath
	}
	if strings.HasSuffix(basePath, "/") {
		if strings.HasPrefix(subPath, "/") {
			return fmt.Sprintf("%s%s", basePath, subPath[1:])
		} else {
			return fmt.Sprintf("%s%s", basePath, subPath)
		}
	}
	if strings.HasPrefix(subPath, "/") {
		return fmt.Sprintf("%s%s", basePath, subPath)
	} else {
		return fmt.Sprintf("%s/%s", basePath, subPath)
	}
}

func HasArgFlag(flag string) bool {
	for _, arg := range os.Args {
		if arg == flag {
			return true
		}
	}
	return false
}

func IsDebug() bool {
	return HasArgFlag("debug")
}

// see: website.code-workspace > launch.configurations[0].args
func IsForwardingData() bool {
	return HasArgFlag("forward-data")
}
