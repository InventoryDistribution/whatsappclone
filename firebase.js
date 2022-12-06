// $('#signOut').css('display', 'none');
$(document).ready(function () {

    if (sessionStorage.getItem("email") != "") {
        $('#signOut').show();
        $('#signIn').hide();
    } else {
        $('#signOut').hide();
        $('#signIn').show();
    }
})

function toindexpage() {
    location.replace("index.html");
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then((message) => {
        if (firebase.auth().currentUser.emailVerified) {
            user = firebase.auth().currentUser.email;
            sessionStorage.setItem("email", user);
            document.getElementById("loginmsg").innerHTML = "Login Successfully";
            document.getElementById("backg").style = "background-color:lightgreen; color:rgba(0, 0, 0, 1);";
            setTimeout(toindexpage, 1000);
        } else {
            document.getElementById("loginmsg").innerHTML = "Email is not verified..!!";
            document.getElementById("backg").style = "background-color:rgba(255, 90, 90, 1); color:rgba(255, 255, 255, 1);";
        }
    }).catch((error) => {
        document.getElementById("loginmsg").innerHTML = error.message;
        document.getElementById("backg").style = "background-color:rgba(255, 90, 90, 1); color:rgba(255, 255, 255, 1);";
    });


}

function forgotPass() {
    const email = document.getElementById("email").value;
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            document.getElementById("loginmsg").innerHTML = "Reset link sent to your email id";
            document.getElementById("backg").style = "background-color:yellow; color:rgba(0, 0, 0, 1);";
        })
        .catch((error) => {
            document.getElementById("loginmsg").innerHTML = "Enter email first ";
            document.getElementById("backg").style = "background-color:yellow; color:rgba(0, 0, 0, 1);";
            // document.getElementById("backg").style = "background-color:rgba(255, 90, 90, 1); color:rgba(255, 255, 255, 1);";
        });
}


//sign In

function signUp() {
    // const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then((meassage) => {
        // alert("SignUp successfully...!!");
        sendVerificationMail();
        location.replace("signin.html");
    })
        .catch((error) => {
            // alert(error.message);
            document.getElementById("ignupmsg").innerHTML = error.message;
            document.getElementById("backg").style = "background-color:rgba(255, 90, 90, 1); color:rgba(255, 255, 255, 1);";
        });
}

function sendVerificationMail() {
    firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
            // toindexpage();
            alert("New email is verified");
        })
        .catch((error) => {
            alert(error);
        })
}

//sign out

function logout() {
    sessionStorage.removeItem("email");
    location.replace("signin.html");
    firebase.auth().signOut();
}

//change email address

function changeEmail() {
    let person = prompt("Please enter new mail : ");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const user = firebase.auth().currentUser;
            user.updateEmail(person).then(() => {
                // Update successful
                var actionCodeSettings = {
                    // URL you want to redirect back to. The domain (www.example.com) for this
                    // URL must be in the authorized domains list in the Firebase Console.
                    url: 'http://127.0.0.1:5500/pages/index.html',
                    // This must be true.
                    handleCodeInApp: true,
                };
                var email = firebase.auth().currentUser.email;
                firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
                    .then(() => {
                        document.getElementById("mail").innerHTML = user.email;
                        alert("Email updated successfully!!");
                        window.localStorage.setItem('email', email);
                        alert("First verify your new email and login again!!");
                        firebase.auth().currentUser.sendEmailVerification()
                            .then(() => {
                                if (firebase.auth().currentUser.emailVerified) {
                                    toindexpage();
                                } else {
                                    window.location.href = "signin.html";
                                }
                            })
                            .catch((error) => {
                                alert(error.message);
                            })
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        alert(errorMessage);
                    });
            }).catch((error) => {
                alert(error.message);
            });
        }
    })


}

function display() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // const photoURL = user.photoURL;
            // const emailVerified = user.emailVerified;
            // var uid = user.uid;
            document.getElementById("fName").innerHTML = user.displayName;
            document.getElementById("pname").innerHTML = user.displayName;
            document.getElementById("mail").innerHTML = user.email;
            // document.getElementById("mno").innerHTML = "+91 XXXXXXXXXX";
            document.getElementById("userimg").src = user.photoURL;
            // ...
        } else {

        }
    });
}
display();


function signInWithGoogle() {
    // alert();
    // alert('TODO: Implement Google Sign-In');
    // TODO 1: Sign in Firebase with credential from the Google user.
    // var credential = firebase.auth.EmailAuthProvider.credential(email, password);
    var provider = new firebase.auth.GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().languageCode = 'eng';
    // firebase.auth().signInWithRedirect(provider);

    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            var u1 = firebase.auth().currentUser;
            sessionStorage.setItem('email', u1.email);
            result = window.location.href = "index.html";
            // /** @type {firebase.auth.OAuthCredential} */
            var credential = firebase.auth.OAuthCredential.result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = firebase.auth.OAuthCredential.credential.accessToken;
            // The signed-in user info.
            var user = firebase.auth.OAuthCredential.result.user;
            // ...
        }).catch((error) => {
            alert(error.message);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

}

function chklogin() {
    if (sessionStorage.getItem("email") == "" || sessionStorage.getItem("email") == null) {
        document.location.href = "signin.html";
    }
    // else {
    //     document.location.href = "index.html";
    // }
    // alert(sessionStorage.getItem("email"));
}