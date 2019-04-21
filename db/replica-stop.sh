read -p "Are you absolutely sure the mongodb instances A1, A2, A3 of setA and B1, B2, B3 of setB are currently running? " res

case $res in
    [Yy]* )
        sudo mongod --config /etc/mongod-A1.conf --shutdown
        sudo mongod --config /etc/mongod-A2.conf --shutdown
        sudo mongod --config /etc/mongod-A3.conf --shutdown

        sudo mongod --config /etc/mongod-B1.conf --shutdown
        sudo mongod --config /etc/mongod-B2.conf --shutdown
        sudo mongod --config /etc/mongod-B3.conf --shutdown
        exit;;
    * )
        exit;;
esac
