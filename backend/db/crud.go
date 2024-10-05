package db

import (
	"encoding/json"
	"io"

	badger "github.com/dgraph-io/badger/v4"
)

var ErrKeyNotFound = badger.ErrKeyNotFound

// GetByLink returns a ErrKeyNotFound if the link does not exist
// otherwise it returns the deserialized json object
func GetByLink[T any](db *DB, link Link) (*T, error) {
	var jsonString []byte
	err := db.db.View(func(txn *badger.Txn) error {
		item, err := txn.Get(link)
		if err != nil {
			if err == badger.ErrKeyNotFound {
				return ErrKeyNotFound
			}
			return err
		}
		jsonString, err = item.ValueCopy(nil)
		return err
	})
	if err != nil {
		return nil, err
	}

	var obj T
	err = json.Unmarshal(jsonString, &obj)
	if err != nil {
		return nil, err
	}

	return &obj, nil
}

// SetByLink writes the object as json to the link addressed place in the DB
func SetByLink[T any](db *DB, link Link, value T) error {
	jsonString, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return db.db.Update(func(txn *badger.Txn) error {
		return txn.Set(link, jsonString)
	})
}

// ReadByLink reads the value from the link addressed place in the DB as byte stream
func ReadByLink(db *DB, link Link, output io.Writer) error {
	return db.db.View(func(txn *badger.Txn) error {
		item, err := txn.Get(link)
		if err != nil {
			return err
		}
		return item.Value(func(val []byte) error {
			_, err := output.Write(val)
			return err
		})
	})
}

// WriteByLink writes the value to the link addressed place in the DB as byte stream
func WriteByLink(db *DB, link Link, input io.ReadCloser) error {
	return db.db.Update(func(txn *badger.Txn) error {
		b, err := io.ReadAll(input)
		if err != nil {
			return err
		}
		return txn.Set(link, b)
	})
}

// DeleteByLink deletes the value from the link addressed place in the DB
func DeleteByLink(db *DB, link Link) error {
	return db.db.Update(func(txn *badger.Txn) error {
		return txn.Delete(link)
	})
}

// DeleteWhere deletes all keys with the given prefix that pass the where function with true
func DeleteWhere[T any](db *DB, prefix string, where func(key, value []byte) bool) error {
	return db.db.Update(func(txn *badger.Txn) error {
		it := txn.NewIterator(badger.DefaultIteratorOptions)
		defer it.Close()
		buf := make([]byte, 0, 512)
		for it.Seek([]byte(prefix)); it.ValidForPrefix([]byte(prefix)); it.Next() {
			item := it.Item()
			k := item.Key()
			buf, err := item.ValueCopy(buf)
			if err != nil {
				return err
			}
			if where(k, buf) {
				if err = txn.Delete(k); err != nil {
					return err
				}
			}
		}
		return nil
	})
}

// Iterate iterates over all keys with the given prefix and calls the action function for each key that passes the keyOk function with true
func Iterate[T any](db *DB, prefix string, keyOk func(key []byte) bool, action func(v T) error) error {
	return db.db.View(func(txn *badger.Txn) error {
		var err error
		it := txn.NewIterator(badger.DefaultIteratorOptions)
		defer it.Close()
		buf := make([]byte, 0, 512)
		for it.Seek([]byte(prefix)); it.ValidForPrefix([]byte(prefix)); it.Next() {
			if !keyOk(it.Item().Key()) {
				continue
			}
			buf, err = it.Item().ValueCopy(buf)
			if err != nil {
				return err
			}
			var obj T
			err = json.Unmarshal(buf, &obj)
			if err != nil {
				return err
			}
			if err = action(obj); err != nil {
				return err
			}
		}
		return nil
	})
}
