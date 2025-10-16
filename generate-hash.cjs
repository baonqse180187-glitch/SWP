const bcrypt = require('bcryptjs');

console.log('admin123 hash:', bcrypt.hashSync('admin123', 10));
console.log('staff123 hash:', bcrypt.hashSync('staff123', 10));