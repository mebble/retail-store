const vendor = require('./vendor');

module.exports = (db) => {
    return {
        vendor: vendor(db)
    };
};
