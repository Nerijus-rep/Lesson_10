$(document).ready(function () {
    var obj = [];

    var date = new Date();

    var currentDay = date.getDate();
    if (currentDay < 10) {
        currentDay = "0" + currentDay;
    }

    var currentMonth = date.getMonth() + 1;
    if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
    }

    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var monthName = month[date.getMonth()];
    var currentYear = date.getFullYear();

    var currentDate = "Posted on " + monthName + " " + currentDay + ", " + currentYear;
    // var currentDate =  currentYear + " " + monthName + " " + currentDay;

    var currentHours = date.getHours();
    if (currentHours < 10) {
        currentHours = "0" + currentHours;
    }
    var currentMinutes = date.getMinutes();
    if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
    }
    var currentSeconds = date.getSeconds();
    if (currentSeconds < 10) {
        currentSeconds = "0" + currentSeconds;
    }

    var currentTime = currentHours + ":" + currentMinutes + ":" + currentSeconds;

    /**** logged user data in Local Storage ****/
    var loggedUser = JSON.parse(localStorage.getItem("LoggedUser"));


    /**** Users registration data in Local Storage ****/
    var registeredUsersData = JSON.parse(localStorage.getItem("RegisteredUsersData"));
    if (registeredUsersData == null) {
        $('#login-username').html('Log in');
        $('li #logged-out-style').show();
        $('li #logged-in-style, #logged-in-text, #addpost').hide();
    } else {
        for (var i = 0; i < registeredUsersData.length; i++) {
            var UserID = registeredUsersData[i].UserID;
            var UserName = registeredUsersData[i].UserName;
            var Name = registeredUsersData[i].Name;
            var Age = registeredUsersData[i].Age;
            var Email = registeredUsersData[i].Email;
            var Password = registeredUsersData[i].Password;
            if (loggedUser == null) {
                changeDropdown();
            } else if (loggedUser.LogInUserName == UserName) {
                changeDropdown();
                editUserData(UserID, UserName, Name, Age, Email, Password);
                var logInUserName = loggedUser.LogInUserName;
            }
        }
    }

    var Data = localStorage.getItem("RegisteredUsersData");

    /**** post data in Local Storage ****/
    var postData = JSON.parse(localStorage.getItem("Post"));
    var Post = localStorage.getItem("Post");

    if (postData == null) {
        $('.post-sort-dropdown').hide();
    } else {
        for (var i = 0; i < postData.length; i++) {
            var postDataPostID = JSON.stringify(postData[i].PostID);
            var postDataUserID = postData[i].UserID;
            var postDataUser = postData[i].User;
            var postDataDate = postData[i].Date;
            var postDataTime = postData[i].Time;
            var postDataSubject = postData[i].Subject;
            var postDataPostText = postData[i].Text;
            var postDataPostComments = postData[i].PostComments;
            showPosts(postDataPostID, postDataUser, postDataDate, postDataTime, postDataSubject, postDataPostText, postDataPostComments);
            getPostID(postDataPostID);
        }
        if (postData.length <= 1) {
            $('.post-sort-dropdown').hide();
        } else {
            $('.post-sort-dropdown').show();
        }
    }

    /**** Post user data ****/
    var PostUser = JSON.parse(localStorage.getItem("PostUser"));

    getUserData();
    editingPost();

    /**** set age of birth ****/
    $("#selected-year, #selected-month, #selected-day").change(function () {
        var selectedMonth = $("#selected-month option:selected").val();
        var selectedDay = $("#selected-day option:selected").val();
        var str = "";
        $("#selected-year option:selected").each(function () {
            str += $(this).val();
        });
        if (str === "") {
            $("#input-Age").val(str);
        } else if (selectedMonth > currentMonth) {
            $("#input-Age, #edit-Age").val(currentYear - str - 1);
        } else if (selectedMonth >= currentMonth && selectedDay > currentDay) {
            $("#input-Age, #edit-Age").val(currentYear - str - 1);

        } else {
            $("#input-Age, #edit-Age").val(currentYear - str);
        }
    })
        .trigger("change");

    /**** set User registration data to Local Storage ****/
    $(document).on("click", "#sign-up-submit", function () {
        var UserName = $("#input-User-Name").val();
        var Name = $("#input-Name").val();
        var Age = $("#input-Age").val();
        var Email = $("#input-Email").val();
        var Password = $("#input-Password").val();
        var ConfirmPassword = $("#input-Confirm-Password").val();

        if (UserName === "") {
            bootbox.alert({
                message: "Required to enter a UserName !",
                size: 'small'
            });
            return;
        } else if (Name === "") {
            bootbox.alert({
                message: "Required to enter a Name !",
                size: 'small'
            });
            return;
        } else if (Age === "") {
            bootbox.alert({
                message: "Required to enter Age !",
                size: 'small'
            });
            return;
        } else if (Email === "") {
            bootbox.alert({
                message: "Required to enter Email !",
                size: 'small'
            });
            return;
        } else if (Password === "") {
            bootbox.alert({
                message: "Required to enter password !",
                size: 'small'
            });
            return;
        } else if (ConfirmPassword === "") {
            bootbox.alert({
                message: "Required to enter a Confirm Password !",
                size: 'small'
            });
            return;
        } else if (ConfirmPassword != Password) {
            bootbox.alert({
                message: "The Password is not the same as Confirmed Password !",
                size: 'small'
            });
            return;
        }

        if (registeredUsersData == null && ConfirmPassword === Password) {
            bootbox.alert({
                message: "Your account has been successfully created !",
                size: 'small'
            });
            var UserID = 1;
            obj.push({ "UserID": UserID, "UserName": UserName, "Name": Name, "Age": Age, "Email": Email, "Password": Password });
            localStorage.setItem("RegisteredUsersData", JSON.stringify(obj));
            localStorage.setItem('LoggedUser', JSON.stringify({ "LogInID": UserID, "LogInUserName": UserName }));
            changeDropdown();
            goToIndex();
        }

        /**** check Username and Email with data in localstorage ****/
        else if (registeredUsersData != null && ConfirmPassword === Password) {
            for (var i = 0; i < registeredUsersData.length; i++) {
                var DataUserName = registeredUsersData[i].UserName;
                var DataEmail = registeredUsersData[i].Email;
                var UserID = registeredUsersData[i].UserID + 1;
                if (UserName === DataUserName) {
                    bootbox.alert({
                        message: "This User Name already exists !",
                        size: 'small'
                    });
                    break;
                }
                if (Email === DataEmail) {
                    bootbox.alert({
                        message: "This Email already exists !",
                        size: 'small'
                    });
                    break;
                }
            }
            if (UserName != DataUserName && Email != DataEmail && ConfirmPassword === Password) {
                bootbox.alert({
                    message: "Your account has been successfully created !",
                    size: 'small'
                });
                obj = JSON.parse(Data);
                obj.push({ "UserID": UserID, "UserName": UserName, "Name": Name, "Age": Age, "Email": Email, "Password": Password });
                localStorage.setItem("RegisteredUsersData", JSON.stringify(obj));
                localStorage.setItem('LoggedUser', JSON.stringify({ "LogInID": UserID, "LogInUserName": UserName }));
                changeDropdown();
                goToIndex();
            }
        }
    });



    $(document).on("click", "#log-in-submit", function () {
        var namefound = false;
        var CheckUserName = $('#check-user-name').val();
        var CheckUserPassword = $('#check-password').val();

        if (CheckUserName === "") {
            bootbox.alert({
                message: "Required to enter a Name !",
                size: 'small'
            });
            return;
        } else if (CheckUserPassword === "") {
            bootbox.alert({
                message: "Required to enter a password !",
                size: 'small'
            });
            return;
        }

        if (registeredUsersData == null) {
            bootbox.alert({
                message: "Name not found !",
                size: 'small'
            });
            return;
        }

        for (var i = 0; i < registeredUsersData.length; i++) {
            var DataUserName = registeredUsersData[i].UserName;
            var DataPassword = registeredUsersData[i].Password;
            var DataID = registeredUsersData[i].UserID;

            if (CheckUserName === DataUserName) {
                namefound = true;
            }

            if (CheckUserName === DataUserName && CheckUserPassword === DataPassword) {
                bootbox.alert({
                    message: "Connected",
                    size: 'small'
                });
                localStorage.setItem('LoggedUser', JSON.stringify({ "LogInID": DataID, "LogInUserName": DataUserName }));
                changeDropdown();
                location.reload();
            } else if (CheckUserName === DataUserName && CheckUserPassword !== DataPassword) {
                bootbox.alert({
                    message: "Wrong password !",
                    size: 'small'
                });
                break;
            }
        }

        if (!namefound) {
            bootbox.alert({
                message: "Name not found !",
                size: 'small'
            });
        }
    });

    /****in navbar show LOGIN if user logged out, or USERNAME when user logged in ****/
    function changeDropdown() {
        if (loggedUser == null) {
            $('#login-username').html('Log in');
            $('li #logged-out-style').show();
            $('li #logged-in-style, #logged-in-text, #addpost').hide();

        } else {
            $('#login-username').html(loggedUser.LogInUserName);
            $('li #logged-in-style, #logged-in-text, #addpost').show();
            $('li #logged-out-style').hide();
        }
    }


    /**** User logged out function ****/
    $(document).on("click", "#log-out-submit", function () {
        var addPostPage = "addpost.html";
        var currentPage = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

        if (addPostPage === currentPage) {
            localStorage.removeItem('LoggedUser');
            goToIndex();
        } else {
            localStorage.removeItem('LoggedUser');
            location.reload();
        }
    });

    /**** set new post to local storage ****/
    $(document).on("click", "#insert-post-btn", function () {

        var postsubject = $("#post-subject").val();
        var postText = $("#post-main-text").val();
        var postComments = "";

        if (postData == null) {
            var PostID = 1;
        } else {
            for (var i = 0; i < postData.length; i++) {
                var PostID = postData[i].PostID + 1;
            }
        }

        if (postsubject === "") {
            bootbox.alert({
                message: "Subject field is required !",
                size: 'small'
            });
            return;
        } else if (postText === "") {
            bootbox.alert({
                message: "Post text field is required !",
                size: 'small'
            });
            return;
        }

        if (postData) {
            obj = JSON.parse(Post);
        }
        obj.push({ "PostID": PostID, "UserID": loggedUser.LogInID, "User": loggedUser.LogInUserName, "Date": currentDate, "Time": currentTime, "Subject": postsubject, "Text": postText, "PostComments": postComments });
        localStorage.setItem("Post", JSON.stringify(obj));
        bootbox.alert({
            message: "Your new post was created successfully !",
            callback: function (result) {
                goToIndex();
            }
        });
    });

    /**** set post to HTML from Local Storage ****/
    function showPosts(postDataPostID, postDataUser, postDataDate, postDataTime, postDataSubject, postDataPostText, postDataPostComments) {
        $(".blog-post").each(function () {
            $(this).prepend(
                "<table class='table'>" +
                "<tbody>" +
                "<tr>" +
                "<td id='" + postDataPostID + "'>" +
                "<div class='col-xs-12 post-subject' ><p>" + postDataSubject + "</p></div>" +
                "<div class='col-xs-12 postDateTime' >" + postDataDate + ' ' + postDataTime + "</div>" +
                "<div class='col-xs-6 post-user-text'><p>" + "Posted by " + ' ' + "<a href='#' class='postDataUser'>" + postDataUser + "</a></div>" +
                "<div class='col-xs-12 post-text' ><p>" + postDataPostText + "</p></div>" +
                "<div class='col-xs-6'><p><a href='#' id='showComments'>Read comments</a><a href='#' class='btn disabled' id='noComments'>There is no comments</a></div>" +
                "<div class='col-xs-6 text-right'><a href='#' id='writeComment'>Comment</a></p></div>" +

                "<div class='col-xs-12 commentArea'>" +
                "<div class='col-xs-6'><p>" + logInUserName + "</div>" +
                "<div class='col-xs-6 text-right'><button type='button' id='set-comment' class='btn btn-default btn-xs'>Leave comment</button></p></div>" +
                "<div class='col-xs-12'><p><textarea class='form-control' rows='3'></textarea></p></div>" +
                "</div>" +

                "<div class='col-xs-12 post-comments'>" +
                "</div>" +

                "</td>" +
                "</tr>" +
                "<tr><td></td></tr>" +
                "</tbody>" +
                "</table>");

        });
    }

    /**** edit post ****/
    $(document).on("click", "#edit-post", function () {
        $('[data-toggle="tooltip"]').tooltip();
        var postID = $(this).closest(".user-post-container").attr("id");
        bootbox.confirm({
            message: "You want to edit information for this post ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                },
                cancel: {
                    label: 'No',
                }
            },
            callback: function (result) {
                if (result == true) {
                    for (var i = 0; i < postData.length; i++) {
                        var postIDFromLocal = JSON.stringify(postData[i].PostID);
                        var postSubjectFromLocal = JSON.stringify(postData[i].Subject);
                        var postTextFromLocal = JSON.stringify(postData[i].Text);
                        if (postID == postIDFromLocal) {

                            var editablePost = { "ID": postID, "Subject": postData[i].Subject, "Text": postData[i].Text };
                            localStorage.setItem("PostForEdit", JSON.stringify(editablePost));
                        }

                    }
                    location.href = "editpost.html";
                }
            }
        });
    });

    function editingPost() {
        var PostForEdit = JSON.parse(localStorage.getItem("PostForEdit"));
        if (PostForEdit == null) {
            return;
        } else {
            $('#edit-subject').val(PostForEdit.Subject);
            $('#edit-main-text').val(PostForEdit.Text);
        }
    }

    $(document).on("click", "#edit-post-btn", function () {
        var NameFromLocalToInput = $('#edit-subject').val();
        var SurnameFromLocalToInput = $('#edit-main-text').val();
        var PostForEdit = JSON.parse(localStorage.getItem("PostForEdit"));
        var ID = PostForEdit.ID
        for (var i = 0; i < postData.length; i++) {
            var postIDFromLocal = JSON.stringify(postData[i].PostID);
            if (ID == postIDFromLocal) {
                postData[i].Subject = NameFromLocalToInput;
                postData[i].Text = SurnameFromLocalToInput;
            }
        }
        localStorage.setItem("Post", JSON.stringify(postData));
        goToIndex();

    });

    /**** remove post ****/
    $(document).on("click", "#remove-post", function () {
        $('[data-toggle="tooltip"]').tooltip();
        var postID = $(this).closest(".user-post-container").attr("id");
        bootbox.confirm({
            message: "You want to remove this post ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                },
                cancel: {
                    label: 'No',
                }
            },
            callback: function (result) {
                if (result == true) {
                    for (var i = 0; i < postData.length; i++) {
                        var postIDFromLocal = JSON.stringify(postData[i].PostID);
                        if (postID == postIDFromLocal) {
                            postData.splice(i, 1);
                        }
                    }
                    if (postData.length >= 1) {
                        localStorage.setItem("Post", JSON.stringify(postData));
                    } else {
                        localStorage.removeItem("Post");
                    }
                    location.reload();
                }
            }
        });
    });

    /**** create Time and Date since current for comments ****/
    function timeSince(date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);

        if (interval === 1) {
            return interval + " year ago";
        } else if (interval >= 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval === 1) {
            return interval + " month ago";
        } else if (interval >= 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval === 1) {
            return interval + " day ago";
        } else if (interval >= 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval === 1) {
            return interval + " hour ago";
        } else if (interval >= 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval === 1) {
            return interval + " minute ago";
        } else if (interval >= 1) {
            return interval + " minutes ago";
        }
        interval = Math.floor(seconds);
        if (interval === 1) {
            return interval + " second ago";
        } else if (interval >= 1) {
            return interval + " seconds ago";
        }
    }


    /**** set post comments to HTML from Local Storage ****/
    function getPostID(postDataPostID) {
        $('.blog-post .post-comments').each(function () {
            var postIDattribute = $(this).closest("td").attr("id");
            if (postDataPostComments == "") {
                $("#showComments").hide();
            } else if (postIDattribute === postDataPostID) {
                for (var i = 0; i < postDataPostComments.length; i++) {
                    var commentUser = postDataPostComments[i].CommentUser;
                    var commentText = postDataPostComments[i].Comment;
                    var commentDate = Date.parse(postDataPostComments[i].CommentDate);
                    var dateSince = timeSince(commentDate);

                    $("#noComments").hide();
                    $(this).append(
                        "<div class='panel panel-default'>" +
                        "<div class='panel-heading'>" + commentUser + ' ' + dateSince + "</div>" +
                        "<div class='panel-body'>" + commentText +
                        "</div></div>");
                }
            }

        });
    }


    /**** insert post comment in to Local Storage ****/
    $(document).on("click", "#set-comment", function () {
        var postUserName = $(this).closest("td").find(".postDataUser").text();
        var postIDattribute = $(this).closest("td").attr("id");
        var comment = $(this).parent().parent().find("textarea").val();
        var commentText = $("textarea").val();
        if (commentText === "") {
            bootbox.alert({
                message: "Comment field is empty !",
                size: 'small'
            });
        } else {
            for (var i = 0; i < postData.length; i++) {
                var postIDFromLocal = JSON.stringify(postData[i].PostID);
                var commentFromLocal = JSON.stringify(postData[i].PostComments);

                if (postData[i].PostComments == "") {
                    var postCommentID = 1;
                    var postCommentsObj = [];
                } else {
                    var postCommentID = postData[i].PostComments.length + 1;
                    postCommentsObj = JSON.parse(commentFromLocal);
                }
                postCommentsObj.push({ "PostCommentID": postCommentID, "CommentDate": date, "CommentUser": loggedUser.LogInUserName, "Comment": comment });
                if (postUserName === postData[i].User && postIDattribute === postIDFromLocal) {
                    postData[i].PostComments = postCommentsObj;
                }
            }
            localStorage.setItem("Post", JSON.stringify(postData));
            location.reload();
        }
    });

    /**** show/hide comment form when user Logged in/out ****/
    $(document).on("click", "#writeComment", function () {
        if (loggedUser == null) {
            bootbox.alert({
                message: "Users must be registered and Logged in !",
            });
        } else {
            $(this).closest("div").next(".commentArea").toggle("slow");
        }
        return false;
    });

    /**** show/hide comments ****/
    $(document).on("click", "#showComments", function () {
        $(this).closest("td").find(".post-comments").toggle("slow");
        return false;
    });

    /**** getting selected post user data ****/
    $(document).on("click", ".logged-User-data", function () {
        for (var i = 0; i < registeredUsersData.length; i++) {
            if (loggedUser.LogInID == registeredUsersData[i].UserID) {
                var PostUser = { "ID": registeredUsersData[i].UserID, "Name": registeredUsersData[i].Name, "UserName": registeredUsersData[i].UserName, "Age": registeredUsersData[i].Age, "Email": registeredUsersData[i].Email };
                localStorage.setItem("PostUser", JSON.stringify(PostUser));
            }
        }
        location.href = "userprofile.html";
    });

    $(document).on("click", ".postDataUser", function () {
        var postCreatorOwner = $(this).text();
        for (var i = 0; i < registeredUsersData.length; i++) {
            if (postCreatorOwner == registeredUsersData[i].UserName) {
                var PostUser = { "ID": registeredUsersData[i].UserID, "Name": registeredUsersData[i].Name, "UserName": registeredUsersData[i].UserName, "Age": registeredUsersData[i].Age, "Email": registeredUsersData[i].Email };
                localStorage.setItem("PostUser", JSON.stringify(PostUser));
            }
        }
        location.href = "userprofile.html";
    });

    function getUserData() {
       if (postDataUserID == UserID) {
            $(".profile-user-username").text(PostUser.UserName);
            $(".profile-user-name").text(PostUser.Name);
            $(".profile-user-age").text(PostUser.Age);
            $(".profile-user-email").text(PostUser.Email);
        }

        if (postData == null) {
            return;
        } else {
            for (var i = 0; i < postData.length; i++) {
                var postDataPostID = JSON.stringify(postData[i].PostID);
                var postDataUser = postData[i].User;
                var postDataDate = postData[i].Date;
                var postDataTime = postData[i].Time;
                var postDataSubject = postData[i].Subject;
                var postDataPostText = postData[i].Text;
                var postDataPostComments = postData[i].PostComments;
                if (PostUser.UserName === postDataUser) {
                    $(".user-posts").prepend(
                        "<div class='user-post-container' id='" + postDataPostID + "'>" +
                        "<div class='col-xs-12 post-subject'  ><p>" + postDataSubject + "</p></div>" +
                        "<div class='col-xs-6 postDateTime' >" + postDataDate + ' ' + postDataTime + "</div>" +
                        "<div class='col-xs-6 text-right' ><a role='menuitem' href='#' id='edit-post'><span class='glyphicon glyphicon-edit' aria-hidden='true' data-toggle='tooltip' data-placement='top' title='Edit post!'></a></span>" +
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "<a role='menuitem' href='#'id='remove-post'><span class='glyphicon glyphicon-remove' aria-hidden='true'data-toggle='tooltip' data-placement='top' title='Remove post!'></a></span><p></div>" +
                        "<div class='col-xs-12 post-text' ><p>" + postDataPostText + "</p></div></div>");
                }
                if (loggedUser == null || loggedUser.LogInUserName != PostUser.UserName) {
                    $("#edit-post").hide();
                    $("#remove-post").hide();
                    $(".edit-profile-user").hide();
                } else if (loggedUser.LogInUserName === PostUser.UserName) {
                    $("#edit-post").show();
                    $("#remove-post").show();
                    $(".edit-profile-user").show();
                }
            }
        }
    }

    /**** edit user data ****/
    function editUserData(UserID, UserName, Name, Age, Email, Password) {
        $("#edit-User-Name").val(UserName);
        $("#edit-Name").val(Name);
        $("#edit-Age").val(Age);
        $("#edit-Email").val(Email);
    }

    $(document).on("click", ".edit-user-profile", function () {
        location.href = "editprofile.html";
    });

    /**** set user registration data to Local Storage ****/
    $(document).on("click", "#edit-user-data", function () {
        var editUserName = $("#edit-User-Name").val();
        var editName = $("#edit-Name").val();
        var editAge = $("#edit-Age").val();
        var editEmail = $("#edit-Email").val();
        var editPassword = $("#edit-Password").val();
        var editConfirmPassword = $("#edit-Confirm-Password").val();

        if (editUserName === "") {
            bootbox.alert({
                message: "Required to enter a UserName !",
                size: 'small'
            });
            return;
        } else if (editName === "") {
            bootbox.alert({
                message: "Required to enter a Name !",
                size: 'small'
            });
            return;
        } else if (editAge === "") {
            bootbox.alert({
                message: "Required to enter a Age !",
                size: 'small'
            });
            return;
        } else if (editEmail === "") {
            bootbox.alert({
                message: "Required to enter a Email !",
                size: 'small'
            });
            return;
        } else if (editPassword === "") {
            bootbox.alert({
                message: "Required to enter a password !",
                size: 'small'
            });
            return;
        } else if (editConfirmPassword === "") {
            bootbox.alert({
                message: "Required to enter a Confirm Password !",
                size: 'small'
            });
            return;
        } else if (editConfirmPassword != editPassword) {
            bootbox.alert({
                message: "The Password is not the same as Confirmed Password !",
                size: 'small'
            });
            return;
        }

        /**** check Username and Email with data in localstorage ****/
        if (editConfirmPassword === editPassword) {

            for (var i = 0; i < registeredUsersData.length; i++) {
                var DataUserName = registeredUsersData[i].UserName;
                var DataEmail = registeredUsersData[i].Email;
                var Y = registeredUsersData[i].UserID;

                if (editUserName === DataUserName && loggedUser.LogInID != Y) {
                    bootbox.alert({
                        message: "This User Name already exists !",
                        size: 'small'
                    });
                    break;
                }
                if (editEmail === DataEmail && loggedUser.LogInID != Y) {
                    bootbox.alert({
                        message: "This Email already exists !",
                        size: 'small'
                    });
                    break;
                }

                if (loggedUser.LogInID === registeredUsersData[i].UserID) {

                    registeredUsersData[i].UserName = editUserName;
                    registeredUsersData[i].Name = editName;
                    registeredUsersData[i].Age = editAge;
                    registeredUsersData[i].Email = editEmail;
                    registeredUsersData[i].Password = editPassword;

                    localStorage.setItem("RegisteredUsersData", JSON.stringify(registeredUsersData));
                    localStorage.setItem("LoggedUser", JSON.stringify({ "LogInID": registeredUsersData[i].UserID, "LogInUserName": editUserName }));
                    localStorage.setItem("PostUser", JSON.stringify({ "ID": registeredUsersData[i].UserID, "UserName": registeredUsersData[i].UserName, "Name": registeredUsersData[i].Name, "Age": registeredUsersData[i].Age, "Email": registeredUsersData[i].Email }));
                }
            }
            for (var i = 0; i < postData.length; i++) {
                if (loggedUser.LogInID === postData[i].UserID) {
                    postData[i].User = editUserName;
                    localStorage.setItem("Post", JSON.stringify(postData));
                }
            }
        }
        changeDropdown();
        goToIndex();
    });

    /**** sorting functions ****/
    $(document).on("click", "#sort-newer-older li", function () {
        if ($(this).text() === "older") {
            var numericallyOrderedDivs = $("table").sort(function (a, b) {
                return $(a).find(".postDateTime").text() > $(b).find(".postDateTime").text();
            });
            $(".blog-post").html(numericallyOrderedDivs);
        } else if ($(this).text() === "newer") {
            var numericallyOrderedDivs = $("table").sort(function (a, b) {
                return $(a).find(".postDateTime").text() < $(b).find(".postDateTime").text();
            });
            $(".blog-post").html(numericallyOrderedDivs);
        }
    });

    $(document).on("click", "#sort-alphabetically li", function () {
        if ($(this).text() === "A-Z") {
            var numericallyOrderedDivs = $("table").sort(function (a, b) {
                return $(a).find(".postDataUser").text() > $(b).find(".postDataUser").text();
            });
            $(".blog-post").html(numericallyOrderedDivs);
        } else if ($(this).text() === "Z-A") {
            var numericallyOrderedDivs = $("table").sort(function (a, b) {
                return $(a).find(".postDataUser").text() < $(b).find(".postDataUser").text();
            });
            $(".blog-post").html(numericallyOrderedDivs);
        }
    });

    $(document).on("click", "#user-post-newer-older li", function () {
        if ($(this).text() === "older") {
            var numericallyOrderedDivs = $(".user-post-container").sort(function (a, b) {
                return $(a).find(".postDateTime").text() > $(b).find(".postDateTime").text();
            });
            $(".user-posts-container").html(numericallyOrderedDivs);
        } else if ($(this).text() === "newer") {
            var numericallyOrderedDivs = $(".user-post-container").sort(function (a, b) {
                return $(a).find(".postDateTime").text() < $(b).find(".postDateTime").text();
            });
            $(".user-posts-container").html(numericallyOrderedDivs);
        }
    });

    function goToIndex() {
        location.href = "index.html";
    }
});