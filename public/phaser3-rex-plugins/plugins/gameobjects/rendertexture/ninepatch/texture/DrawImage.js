import MakeChildImageGameObject from "../../../../utils/rendertexture/MakeChildImageGameObject";

var DrawImage = function (key, frame, x, y, width, height) {
    var gameObject = MakeChildImageGameObject(this, '_image', 'image')
        .setTexture(key, frame)
        .setDisplaySize(width, height);

    this.draw(gameObject, x, y);
}

export default DrawImage;