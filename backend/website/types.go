package website

import "net/http"

type Route = func(req *http.Request) (MaybeRoute, error)
type MaybeRoute = func(w http.ResponseWriter, req *http.Request) error
