package loggy

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"runtime"

	"strings"
	"sync"
	"time"

	"github.com/dgraph-io/badger/v4"
)

type LoggingLevel int

var Level LoggingLevel = DEBUG

var WriteCaller = false

var needToFlush = false

type Logger interface {
	badger.Logger
	io.Closer
}

const (
	DEBUG LoggingLevel = iota
	INFO
	WARNING
	ERROR
)

func (l LoggingLevel) String() string {
	switch l {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO"
	case WARNING:
		return "WARNING"
	case ERROR:
		return "ERROR"
	default:
		return "UNKNOWN"
	}
}

var locker = sync.Mutex{}

type csvLog struct {
	fileName  string
	csvFile   *os.File
	csvWriter *csv.Writer
	mutex     sync.Mutex
}

var LogDirectory string

type csvLogEntry = []string

func newCSVLogger() (*csvLog, error) {
	name := LogDirectory + "/" + CurrentLogFileName()
	err := os.MkdirAll(LogDirectory, 0755)
	if err != nil {
		return nil, err
	}
	f, err := os.OpenFile(name, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0644)
	if err != nil {
		return nil, err
	}
	return &csvLog{
		fileName:  name,
		csvFile:   f,
		csvWriter: csv.NewWriter(f),
		mutex:     sync.Mutex{},
	}, nil
}

func (l *csvLog) Close() error {
	l.mutex.Lock()
	defer l.mutex.Unlock()
	l.csvWriter.Flush()
	return l.csvFile.Close()
}

var openCsvLog *csvLog = nil

func CurrentLogFileName() string {
	y, m, d := time.Now().Date()
	return fmt.Sprintf("log_%04d-%02d-%02d.csv", y, m, d)
}

func OpenLogFile() (Logger, error) {
	locker.Lock()
	defer locker.Unlock()

	if openCsvLog == nil {
		if len(LogDirectory) == 0 {
			return nil, fmt.Errorf("LogDirectory not set")
		}
		ll, err := newCSVLogger()
		if err != nil {
			return nil, err
		}
		openCsvLog = ll

		//start flush routine
		go func() {
			for {
				select {
				case <-time.After(5 * time.Second):
					openCsvLog.mutex.Lock()
					if needToFlush {
						openCsvLog.csvWriter.Flush()
						needToFlush = false
					}
					openCsvLog.mutex.Unlock()
				case <-context.Background().Done():
					return
				}
			}
		}()

		return openCsvLog, nil
	} else {
		if CurrentLogFileName() != openCsvLog.fileName {
			openCsvLog.Close()
			needToFlush = false
			ll, err := newCSVLogger()
			if err != nil {
				return nil, err
			}
			openCsvLog.csvFile = ll.csvFile
			openCsvLog.csvWriter = ll.csvWriter
			openCsvLog.fileName = ll.fileName
		}

		return openCsvLog, nil
	}
}

func ReadLogFile() ([][]string, error) {
	f, err := os.Open(LogDirectory + "/" + CurrentLogFileName())
	if err != nil {
		return nil, err
	}
	defer f.Close()
	r := csv.NewReader(f)
	records, err := r.ReadAll()
	if err != nil {
		return nil, err
	}
	return records, nil
}

func newLogEntry(typ LoggingLevel, t time.Time, msg string) csvLogEntry {
	if WriteCaller {
		_, file, line, ok := runtime.Caller(0)
		if ok {
			return []string{typ.String(), t.Format("2006-01-02 15:04:05"), msg, fmt.Sprintf("%s:%d", file, line)}
		}
	}
	return []string{typ.String(), t.Format("2006-01-02 15:04:05"), msg}
}

func Errorf(msg string, args ...interface{}) {
	l, err := OpenLogFile()
	if err != nil {
		panic(err)
	}
	l.Errorf(msg, args...)
}

func Warningf(msg string, args ...interface{}) {
	l, err := OpenLogFile()
	if err != nil {
		panic(err)
	}
	l.Warningf(msg, args...)
}

func Infof(msg string, args ...interface{}) {
	l, err := OpenLogFile()
	if err != nil {
		panic(err)
	}
	l.Infof(msg, args...)
}

func Debugf(msg string, args ...interface{}) {
	l, err := OpenLogFile()
	if err != nil {
		panic(err)
	}
	l.Debugf(msg, args...)
}

func (l *csvLog) Errorf(msg string, args ...interface{}) {
	if Level <= ERROR {
		entry := newLogEntry(ERROR, time.Now(), strings.TrimSpace(fmt.Sprintf(msg, args...)))
		fmt.Printf("[%s] %s: %s\n", entry[0], entry[1], entry[2])
		l.writeEntry(entry)
	}
}

func (l *csvLog) Warningf(msg string, args ...interface{}) {
	if Level <= WARNING {
		entry := newLogEntry(WARNING, time.Now(), strings.TrimSpace(fmt.Sprintf(msg, args...)))
		fmt.Printf("[%s] %s: %s\n", entry[0], entry[1], entry[2])
		l.writeEntry(entry)
	}
}

func (l *csvLog) Infof(msg string, args ...interface{}) {
	if Level <= INFO {
		entry := newLogEntry(INFO, time.Now(), strings.TrimSpace(fmt.Sprintf(msg, args...)))
		fmt.Printf("[%s] %s: %s\n", entry[0], entry[1], entry[2])
		l.writeEntry(entry)
	}
}

func (l *csvLog) Debugf(msg string, args ...interface{}) {
	if Level <= DEBUG {
		entry := newLogEntry(DEBUG, time.Now(), strings.TrimSpace(fmt.Sprintf(msg, args...)))
		fmt.Printf("[%s] %s: %s\n", entry[0], entry[1], entry[2])
		l.writeEntry(entry)
	}
}

func (l *csvLog) writeEntry(entry []string) {
	openCsvLog.mutex.Lock()
	err := l.csvWriter.Write(entry)
	if err != nil {
		log.Println("LOGGY: cannot write to csv file:", err)
	} else {
		needToFlush = true
	}
	openCsvLog.mutex.Unlock()
}
