function validation(){
    var a = document.getElementById('user').value;
    var b = document.getElementById('mails').value;
    var c = document.getElementById('word').value;
    var d = document.getElementById('words').value;

if(a == "" ){
    document.getElementById('hi').innerHTML = "  * Please Enter User Name " ;
    return false;
}
if(isNaN(a.charAt(0)) !== true){
    document.getElementById('hi').innerHTML = "  * No number plz" ;
    return false;
}
if(a.length < 3 ){
    document.getElementById('hi').innerHTML = "  * Username is too Short " ;
    return false;
}


if(b == "" ){
    document.getElementById('mail').innerHTML = "  * Please Enter Your email id " ;
    return false;
}


if(c == "" ){
    document.getElementById('word1').innerHTML = "  * Please Enter Your Password" ;
    return false;
}
if(c.length < 8 ){
    document.getElementById('word1').innerHTML = "  * Password should be more than 8 characters" ;
    return false;
}
if( c.search(/[0-9]/) == -1){
    document.getElementById('word1').innerHTML = "  * need to Enter Atleast one number  (1 to 9 )" ;
    return false;
}
if( c.search(/[A-Z]/) == -1){
    document.getElementById('word1').innerHTML = "  * need to Enter Atleast one uppercase letter (A to Z) " ;
    return false;
}
if( c.search(/[!\@\$\#\%\^\&\*\(\)\-\+]/) == -1){
    document.getElementById('word1').innerHTML = "  * need to Enter Atleast one special character ( @ * & ! @ # ..etc) " ;
    return false;
}


if(d == "" ){
    document.getElementById('word2').innerHTML = "  * Please Enter Password Again " ;
    return false;
}
if(d !== c){

document.getElementById('word2').innerHTML = "  * Password doesn't match. Try again " ;
return false;
}



}