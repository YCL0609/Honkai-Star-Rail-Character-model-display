function jump(line, list, name, other) {
    if (typeof (other) == "undefined" || other == null) {
        window.location.href = "picture.html?line=" + line + "&list=" + list + "&name=" + name;
    } else {
        window.location.href = "picture.html?line=" + line + "&list=" + list + "&name=" + name + "&other=" + other;
    }
}

function jump3D(name) {
    window.location.href = "3d.html?name=" + name;
}