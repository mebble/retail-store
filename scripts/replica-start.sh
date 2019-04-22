read -p "Did you set up the config file (/etc/mongod-X.conf) and storage path (/srv/mongodb/dbX) of the mongodb instances? " res

case $res in
    [Yy]* )
        sudo mongod --config /etc/mongod-A1.conf
        sudo mongod --config /etc/mongod-A2.conf
        sudo mongod --config /etc/mongod-A3.conf

        sudo mongod --config /etc/mongod-B1.conf
        sudo mongod --config /etc/mongod-B2.conf
        sudo mongod --config /etc/mongod-B3.conf

        sudo mongod --config /etc/mongod-meta1.conf
        sudo mongod --config /etc/mongod-meta2.conf
        sudo mongod --config /etc/mongod-meta3.conf
        exit;;
    * )
        exit;;
esac
