

const validateProfileData = (req) => {

    const allowedFields = ["firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"];

    const isValidFields = Object.keys(req.body).every(itm => allowedFields.includes(itm));

    return isValidFields;

}

module.exports = {validateProfileData};