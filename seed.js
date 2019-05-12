const { ObjectID } = require('mongodb');

const vendorsA = [
    {
        // _id: new ObjectID(),
        name: 'XYZ Pvt. Ltd.'
    }
];
const vendorsB = [
    {
        // _id: new ObjectID(),
        name: 'PQR Foo'
    }
];

const itemsA = [
    {
        name: 'XXX Peanut Butter',
        price: 120.00,
        category: 'food',
        vendorID: vendors[0]._id,
    },
    {
        name: 'ABC Shirt',
        price: 700.00,
        category: 'clothing',
        vendorID: vendors[1]._id,
    }
];

const itemsB = [
    {
        // _id: new ObjectID(),
        name: 'BBB Biscuit',
        price: 30.00,
        category: 'food',
        vendorID: vendors[0]._id,
    },
    {
        // _id: new ObjectID(),
        name: 'MMM Momos',
        price: 20.00,
        category: 'food',
        vendorID: vendors[1]._id,
    },
    {
        // _id: new ObjectID(),
        name: 'Pants',
        price: 1000.00,
        category: 'clothing',
        vendorID: vendors[0]._id,
    }
];

db.shards.insertMany([{ name: 'setA', size: 0 }, { name: 'setB', size: 0 }])
