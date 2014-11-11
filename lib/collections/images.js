Images = new FS.Collection("images", {
  stores: [
    new FS.Store.FileSystem("images", {path: "~/Documents/qrorders/public/uploads"})
    // new FS.Store.FileSystem("thumbs", {
    //   path: "~/Documents/qrorders/public/uploads",
    //   transformWrite: function(fileObj, readStream, writeStream) {
    //     // Transform the image into a 10x10px thumbnail
    //     gm(readStream, fileObj.name()).resize('460','250').stream().pipe(writeStream);
    //   }
    // })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

Images.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return false;
  }
});
