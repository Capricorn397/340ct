function getsalt(u){
  var pay = {
    user: u
  }
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
  $.post(
    options, payload, function(data) {

    }
  )
}
