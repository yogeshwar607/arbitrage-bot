const assert = require('assert');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

let Schema = null;

function init() {
    const ObjectId = Schema.Types.ObjectId;
    const logs = new Schema({
        previous: {},
    });
    const userSchema = new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        type: { type: String },
        country: { type: String },
        first_name: { type: String },
        last_name: { type: String },
        dob: { type: Date },
        mobile_no: { type: String },
        postal_code: { type: String },
        state: { type: String },
        city: { type: String },
        address: { type: String },
        nationality: { type: String },
        employment_status: { type: String },
        source_of_funds: { type: String },
        PEP: { type: Boolean },
        // company_details: {
        //     register_type: { type: String },
        //     company_name: { type: String },
        //     company_entity_type: { type: String },
        //     date_of_incorporation: { type: Date },
        //     bussiness_registration_no: { type: String },
        //     proof_of_address: { type: String },
        //     type_of_industry: { type: String },
        //     annual_sales: { type: String },
        //     purpose_of_transfer: { type: String },
        //     overseas_branches: { type: String },
        //     expected_monthly_volume: { type: String },
        //     company_registered_address: {
        //         unit_no: { type: String },
        //         address: { type: String },
        //         postal_code: { type: String }
        //     },
        //     acra_path: { type: String },
        // },
        is_active: { type: Boolean, default: true },

    }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

    // userSchema.pre('save', function(next) {
    //     const user = this;
    //     // only hash the password if it has been modified (or is new)
    //     if (user.isNew || user.isModified('password')) {
    //         // generate a salt
    //         bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    //             if (err) return next(err);
    //             // hash the password using our new salt
    //             bcrypt.hash(user.password, salt, (err, hash) => {
    //                 if (err) return next(err);
    //                 // override the cleartext password with the hashed one
    //                 user.password = hash;
    //                 next();
    //             });
    //         });
    //     } else {
    //         return next();
    //     }
    // });

    // userSchema.methods.comparePassword = function(candidatePassword) {
    //     return new Promise((resolve, reject) => {
    //         bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    //             if (err) return reject(err);
    //             resolve(isMatch);
    //         });
    //     });
    // };

    return userSchema;
}

module.exports = (schema) => {
    assert.ok(schema);
    Schema = schema;
    return init();
};