
exports.getSlug = (str, id, len) => {

    if (str.length > len) {
        str = str.substr(0, len)
    }
    str = str + '-' + id
    str = str.toString()                     // Cast to string
    str = str.toLowerCase()                  // Convert the string to lowercase letters
    str = str.normalize('NFD')       // The normalize() method returns the Unicode Normalization Form of a given string.
    str = str.trim()                         // Remove whitespace from both sides of a string
    str = str.replace(/\s+/g, '-')           // Replace spaces with -
    str = str.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    str = str.replace(/\-\-+/g, '-');     // Replace multiple - with single -

    return str
}

exports.getIdFromSlug = (slug) => {
    var strArry = slug.split("-")
    return strArry[strArry.length - 1]
}

exports.randomString = (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}