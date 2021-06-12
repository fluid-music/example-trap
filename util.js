String.prototype.halfTime = function() {
    const s = this.match(/.{1}/g)
    var out = ""
    s.forEach((c) => {
        out += c
        if (c == " ") {
            out += " "
        } else {
            out += "-"
        }
    })
    return out
}


Array.prototype.fromBinary = function(char) {
    return this.map((x) => (x == 1) ? char : " ").join("")
}