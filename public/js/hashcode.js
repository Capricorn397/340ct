function hashcode(hashCode) {
	console.log(hashCode);
  var hash = 0, i, c, l;
  if (this.length === 0) return hash;
  for (i = 0, l = this.length; i < l; i++){
    c = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
  }
  return hash;
};
