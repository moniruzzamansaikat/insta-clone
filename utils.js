const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "drvxfhd9j",
  api_key: "428568361427533",
  api_secret: "f6pUaoXToZBoBfqmitUDmWMIbJU",
});

exports.uploadImage = async (image, folder = 'insta_posts') => {
  const { public_id, secure_url } = await cloudinary.uploader.upload(image, {
    folder,
  });

  return {
    publicId: public_id,
    url: secure_url,
  };
};

exports.deleteImage = async (publicId) => {
  const resp = await cloudinary.uploader.destroy(publicId);
  return resp;
};
