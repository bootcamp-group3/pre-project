function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const id = profile.getId(); // Do not send to your backend! Use an ID token instead.
    const name = profile.getName();
    const icon = profile.getImageUrl();

    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("icon", icon);


    $.ajax("/api/players", {
        type: "POST",
        data: {
            id: id,
            name: name,
            icon: icon
        }
    });

    $(".signIn").replaceWith("<div>Welcome " + name + "</div><div><button type=\"button\" class=\"btn btn-info btn-lg\" id=\"join-game\">Join a Game Now!</button></div>");
}

$(function () {
    $("#join-game").click(function (event) {
        event.preventDefault();
        window.location.href = "/lobby";
    });
});