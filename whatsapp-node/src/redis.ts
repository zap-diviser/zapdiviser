import Redis from "ioredis"

const redis = new Redis(`redis://:${process.env.REDIS_PASSWORD}@redis:6379`, {
  maxRetriesPerRequest: null
})

export default redis
