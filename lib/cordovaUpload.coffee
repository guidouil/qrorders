if Meteor.isCordova and base = Meteor.absoluteUrl()
  if FS.HTTP.uploadUrl.indexOf(base) < 0
    (base = base + '/') if base[base.length-1] isnt '/'
    (FS.HTTP.uploadUrl = FS.HTTP.uploadUrl.slice 1) if FS.HTTP.uploadUrl[0] is '/'
    FS.HTTP.uploadUrl = base + FS.HTTP.uploadUrl
