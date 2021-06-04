const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//ניצור משתנה מסוג סכמה
const accountSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullname: String,
    email: String,
    password: String,
    createsAt: {type: Date, default: Date.now}, //נרצה אובייקט גם שיהיה לו דאטא טייפ וגם אובייקט עם ערך דיפולטיבי
    isConfirmed: {type: Boolean, default: true}
});
//מייצאים את הסכמה לעולם החיצון, נשים 2 פרמטרים - שם המודל ובאיזה סכמה הוא משתמש 
module.exports = mongoose.model('Account',accountSchema);