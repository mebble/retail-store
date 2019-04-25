const vendors = require('./vendors');

module.exports = (db) => {
    return {
        vendors: vendors(db)
    };
};
