function hashcode(hashCode) {
  var hash = 0, i, c, l;
  if (hashCode.length === 0) return hash;
  for (i = 0, l = hashCode.length; i < l; i++){
    c = hashCode.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
		hash = hash & hash;
  }
  return hash;
};
