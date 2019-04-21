read -p "Did you set up the config files and the data path of mongodb instances A1, A2, A3 of setA and B1, B2, B3 of setB? " res

case $res in
    [Yy]* )
        sudo mongod --config /etc/mongod-A1.conf
        sudo mongod --config /etc/mongod-A2.conf
        sudo mongod --config /etc/mongod-A3.conf

        sudo mongod --config /etc/mongod-B1.conf
        sudo mongod --config /etc/mongod-B2.conf
        sudo mongod --config /etc/mongod-B3.conf
        exit;;
    * )
        exit;;
esac
