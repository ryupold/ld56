package db

import (
	"crypto/rand"
	"log"
	"math"
	"math/big"
	"strconv"
	"sync"

	badger "github.com/dgraph-io/badger/v4"
)

// DB is a wrapper around badger.DB
type DB struct {
	db *badger.DB
}

var dbMutex sync.Mutex
var openedDb *DB = nil

var DBPath = "./data.db"

func OpenDB() (*DB, error) {
	dbMutex.Lock()
	defer dbMutex.Unlock()

	if openedDb != nil {
		return openedDb, nil
	}

	log.Println("open DB connection")

	options := badger.DefaultOptions(DBPath)
	options.Logger = defaultLogger(WARNING)
	bdb, err := badger.Open(options)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	db := DB{db: bdb}
	openedDb = &db
	return openedDb, nil
}

func CloseDB() error {
	db, err := OpenDB()
	if err != nil {
		return err
	}
	log.Println("close DB connection")
	return db.close()
}

type ID uint64

func NewID() ID {
	id, err := rand.Int(rand.Reader, big.NewInt(math.MaxInt64))
	if err != nil {
		panic(err)
	}
	return ID(id.Uint64())
}

func IDFromString(id string) (ID, error) {
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return 0, err
	}
	return ID(idUint), nil
}

// Raw returns a bigendian 8 byte slice representing the ID
func (id ID) Bytes() []byte {
	return []byte(id.String())
}

func (id ID) String() string {
	return strconv.FormatUint(uint64(id), 10)
}

type Link = []byte

// NewLink creates a Link from raw bytes
func NewLink(prefix string, id ID) Link {
	return []byte(prefix + "/" + string(id.Bytes()))
}

func NewLinkSuffix(prefix string, id ID, suffix string) Link {
	return []byte(prefix + "/" + string(id.Bytes()) + "/" + suffix)
}

func (p *DB) close() error {
	defer func() {
		openedDb = nil
	}()
	return p.db.Close()
}

// generate a new Link with current unix timestamp as ID
func SensorReadingLink(timestamp int64) Link {
	return NewLink("reading", ID(timestamp))
}
