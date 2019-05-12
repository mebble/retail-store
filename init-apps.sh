node server.js 4001 & server0_pid=$!
node server.js 4002 & server1_pid=$!
node server.js 4003 & server2_pid=$!
node load-balancer.js 4000
