package website

import (
	"compress/gzip"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"ryupold/website/ludumdare/ld56/loggy"
	"strings"
	"time"
)

func RedirectTo404(w http.ResponseWriter, req *http.Request, html404Path string, slowDown bool) error {
	for _, v := range holdTheLineList {
		if req.URL.Path == v {
			slowDown = true
			slowDownTime := time.Duration(rand.Intn(20)) * time.Second
			fmt.Printf("slow down by (%s) then redirect to 404.html %s?%s\n", slowDownTime, req.URL.Path, req.URL.RawQuery)
			<-time.After(slowDownTime)
		}
	}
	if !slowDown {
		if req.URL.RawQuery != "" {
			loggy.Infof("redirect to 404.html %s?%s\n", req.URL.Path, req.URL.RawQuery)
		} else {
			loggy.Infof("redirect to 404.html %s\n", req.URL.Path)
		}
	}

	return ServeFile(w, req, html404Path, true)
}

func SlowDown(d time.Duration, u MaybeRoute) MaybeRoute {
	return func(w http.ResponseWriter, req *http.Request) error {
		<-time.After(d)
		return u(w, req)
	}
}

func RedirectTo403(w http.ResponseWriter, req *http.Request) error {
	w.WriteHeader(403)
	w.Write([]byte("✋❓🤔"))
	return nil
}

func Inline(w http.ResponseWriter) {
	w.Header().Set("Content-Disposition", "inline")
}

const (
	MaxAgeOneHour  uint64 = 3600
	MaxAgeOneDay   uint64 = 86400
	MaxAgeOneWeek  uint64 = 604800
	MaxAgeOneMonth uint64 = 2592000
)

func Cache(w http.ResponseWriter, maxAge uint64) {
	w.Header().Set("Cache-Control", fmt.Sprintf("max-age=%d, must-revalidate", maxAge))
}
func NoCache(w http.ResponseWriter) {
	w.Header().Set("Cache-Control", "no-cache")
}
func NoStore(w http.ResponseWriter) {
	w.Header().Set("Cache-Control", "must-understand, no-store")
}

func ServeFile(w http.ResponseWriter, req *http.Request, filePath string, compress bool) (err error) {
	defer func() {
		if err != nil {
			err = fmt.Errorf(strings.ReplaceAll(err.Error(), ProjectRoot, ""))
		}
	}()
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}

	defer file.Close()
	stat, err := file.Stat()
	if err != nil {
		return err
	}

	//headers
	WriteContentType(file.Name(), w)
	w.Header().Set("Permissions-Policy", "fullscreen=*")

	output := io.Writer(w)
	if compress {
		w.Header().Set("Content-Encoding", "gzip")
		output = gzip.NewWriter(w)
	}
	defer func() {
		if compress {
			output.(*gzip.Writer).Close()
		}
	}()

	n, err := io.Copy(output, file)
	if err != nil {
		return err
	}
	if stat.Size() != n {
		return fmt.Errorf("expected %d bytes, but only %d bytes written", stat.Size(), n)
	}
	return nil
}

func IsPath(path string, rx *regexp.Regexp) bool {
	return rx.Match([]byte(path))
}

func CombineRoutes(routes ...[]Route) []Route {
	r := make([]Route, 0, len(routes))
	for _, routies := range routes {
		r = append(r, routies...)
	}
	return r
}

func Decide(routes []Route) func(w http.ResponseWriter, req *http.Request) {
	return func(w http.ResponseWriter, req *http.Request) {
		toDo, err := Match(req, routes)

		if err == ErrUnauthorized {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		} else if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
			return
		}

		if toDo != nil {
			if err := toDo(w, req); err != nil {
				if err == ErrUnauthorized {
					w.WriteHeader(403)
				} else {
					w.WriteHeader(500)
				}
				w.Write([]byte(err.Error()))
			}
		} else {
			RedirectTo404(w, req, JoinPaths(Config.FrontendPath, "/main/errors/404.html"), false)
		}
	}
}

type HttpsRedirectHandler struct{}

func (h *HttpsRedirectHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Location", fmt.Sprintf("https://%s%s", req.Host, req.RequestURI))
	w.WriteHeader(301)
	w.Write([]byte{})
}

// used by Decide
func Match(req *http.Request, routes []Route) (MaybeRoute, error) {
	for _, route := range routes {
		work, err := route(req)
		if err != nil {
			return work, err
		}
		if work != nil {
			return work, nil
		}
	}
	return nil, nil
}
