node server.js 3001 & server0_pid=$!
node server.js 3002 & server1_pid=$!
node server.js 3003 & server2_pid=$!
node load-balancer.js 3000
