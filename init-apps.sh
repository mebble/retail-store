node app.js 3001 & app0_pid=$!
node app.js 3002 & app1_pid=$!
node app.js 3003 & app2_pid=$!
node load-balancer.js 3000
