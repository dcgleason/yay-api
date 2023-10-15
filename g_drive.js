

// upload document

var fileMetadata = {
    'name': 'photo.jpg'
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('files/photo.jpg')
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });