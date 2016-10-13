function getsalt(u){
var pay = {user: u}
var dat = JSON.Stringify(pay.SerialiseArray())
var async = true
var options = {
  host: '164.132.195.20:3000',
  path: '/api/login/salt',
  method: 'POST'
}
$.post(
    options, pay, function(data){
    var salt = data
    checkuser(u, password, salt)
  }
)
}
function checkuser(u, p, s){
var prepass = s + p
String.prototype.hashCode = function() {
  var i, c, l
  if (this.length === 0) return hashCode
  for (i = 0, l = this.length; i < l; i++){
    c = this.charCodeAt(i);
    var hashpass = ((hash << 5) - hash) + c;
    hashpass |= 0
  }
}
var payload = {
  username: u,
  password: hashpass
}
JSON.Stringify(payload.SerialiseArray())
$.post(
  options, payload, function(data) {

  }
)
}
/*  function getsalt() {
    const use = document.getElementById("user");
    const pass = document.getElementById("password");
    var pay = { user: use };
    var dat = JSON.Stringify(pay.SerialiseArray());
    var async = true;
    let salt = $.ajax( {
      type: 'POST',
      url: "164.132.195.20:3000",
      path: "api/login/salt"
      data: dat,
      error: function() {
        alert("Help");},
      success: function(){
        alert("Done");
      });
      return false;
  };
  }
  //function checkuser(){
  //  console.log(salt)
    /*var prepass = s + p;
    String.prototype.hashCode = function() {
    var i, c, l;
    if (this.length === 0) return hashCode;
      for (i = 0, l = this.length; i < l; i++){
        c = this.charCodeAt(i);
        var hashpass = ((hash << 5) - hash) + c;
        hashpass |= 0;
      }
    }
    var payload = {
      username: u,
      password: hashpass
    }
    JSON.Stringify(payload.SerialiseArray());
    $.post(options, payload, function(data) {

    });*/
  //}
