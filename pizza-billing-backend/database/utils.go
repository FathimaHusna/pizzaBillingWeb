package database

import "time"

// GetCurrentTimestamp returns the current time in the desired format
func GetCurrentTimestamp() time.Time {
	return time.Now().UTC() // You can use time.Now() if you prefer local time
}
