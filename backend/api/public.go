package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"ryupold/website"
	"ryupold/website/ludumdare/ld56/db"

	"strings"
)

var database *db.DB

// var apiCreatures = regexp.MustCompile(`^\/api\/creatures\/?(?:$|\?)`)

func PublicAPI(config APIConfig) func(r *http.Request) (website.MaybeRoute, error) {
	return func(r *http.Request) (website.MaybeRoute, error) {
		// path := Path(Config.APIPrefix, r)

		return nil, nil
	}
}

func SaveSomethingToDB(thing any) error {
	if err := ensureDBExists(); err != nil {
		return err
	}

	return db.SetByLink(database, db.NewLink("/something", db.NewID()), thing)
}

func ensureDBExists() error {
	if database == nil {
		var err error
		database, err = db.OpenDB()
		if err != nil {
			return err
		}
	}
	return nil
}

// getPath returns the path without the prefix
func Path(prefix string, r *http.Request) string {
	p := strings.TrimPrefix(r.URL.Path, prefix)
	if p == "" {
		p = "/"
	}

	return p
}

func isPath(path string, rx *regexp.Regexp) bool {
	return rx.Match([]byte(path))
}

func writeOkJSON(w http.ResponseWriter, obj any) error {
	data, err := json.Marshal(obj)
	if err != nil {
		return writeErrorJSON(w, 500, "marshalling JSON", err)
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(data)

	return nil
}

func writeErrorJSON(w http.ResponseWriter, status int, description string, err error) error {
	w.WriteHeader(status)
	w.Header().Add("Content-Type", "application/json")
	if err == nil {
		w.Write([]byte(fmt.Sprintf(`{"description": "%s"}`, description)))
	} else {
		w.Write([]byte(fmt.Sprintf(`{"description": "%s", "error": "%s"}`, description, err)))
	}
	return nil
}
