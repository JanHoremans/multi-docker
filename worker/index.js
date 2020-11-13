const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
//const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2)+ "!";
}

redisClient.on('message', (channel, message) => {
  console.log('Received message in worker');
  redisClient.hset('values', message, fib(parseInt(message)));
  console.log('Set Fib in redis');
});

console.log('Subscribing on redis');
redisClient.subscribe('insert');
console.log('Subscribed');
