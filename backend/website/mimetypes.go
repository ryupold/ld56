package website

import (
	"net/http"
	"strings"
)

var ExtensionToMimeType = map[string]string{
	"htm":  "text/html",
	"html": "text/html",
	"txt":  "text/plain",
	"md":   "text/markdown",
	"js":   "text/javascript",
	"json": "application/json",
	"css":  "text/css",
	"csv":  "text/csv",
	"ico":  "image/x-icon",
	"svg":  "image/svg+xml",

	"jpg":  "image/jpeg",
	"jpeg": "image/jpeg",
	"png":  "image/png",
	"gif":  "image/gif",
	"webp": "image/webp",

	"pdf": "application/pdf",

	"zip": "application/zip",

	"doc":  "application/msword",
	"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"ppt":  "application/vnd.ms-powerpoint",
	"xls":  "application/vnd.ms-excel",
	"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

	"xml": "application/xml",
	"exe": "application/x-msdownload",

	"mp3":  "audio/mpeg",
	"mp4":  "video/mp4",
	"avi":  "video/x-msvideo",
	"mov":  "video/quicktime",
	"wmv":  "video/x-ms-wmv",
	"mpg":  "video/mpeg",
	"mpeg": "video/mpeg",
	"mkv":  "video/x-matroska",
	"webm": "video/webm",
}

func GetMimeType(ext string) string {
	if len(ext) == 0 {
		return ""
	}
	if ext[0] == '.' {
		ext = ext[1:]
	}

	contentType, ok := ExtensionToMimeType[ext]
	if ok {
		return contentType
	}
	return "application/x-unknown-content-type"
}

const UnknownMimeType = "application/x-unknown-content-type"

func WriteContentType(path string, w http.ResponseWriter) {
	if len(path) == 0 {
		return
	}
	last := strings.LastIndex(path, "/")
	if last >= 0 && last < len(path)-1 {
		path = path[last+1:]
	}

	last = strings.LastIndex(path, ".")
	if last >= 0 && last < len(path)-1 {
		path = path[last+1:]
	}
	contentType, ok := ExtensionToMimeType[path]
	if ok {
		w.Header().Set("Content-Type", contentType)
	}

}
