class Camera {
  constructor() {
    //this.fov = 60;
    this.eye=new Vector3([0,0,0]);
    this.at=new Vector3([0,0,-1]);
    this.up=new Vector3([0,1,0]);
    //var g_eye=[0,0,0]; // 0,0,3
    //var g_at=[0,0,-1]; // 0,0,-100
    //var g_up=[0,0,0];  //0,1,0
  }

forward(speed) {
/*
  var f = this.at.subtract(this.eye);
  f=f.divide(f.length());
  this.at=this.at.add(f);
  this.eye=this.eye.add(f);
*/
  let f = new Vector3(this.at.elements);
  f.sub(this.eye);
  f.normalize();
  f.mul(speed);
  this.eye.add(f);
  this.at.add(f);
}

back(speed) {
/*
  var f = this.eye.subtract(this.at);
  f=f.divide(f.length());
  this.at=this.at.add(f);
  this.eye=this.eye.add(f);
*/
  let b = new Vector3(this.eye.elements);
  b.sub(this.at);
  b.normalize();
  b.mul(speed);
  this.eye.add(b);
  this.at.add(b);
}

left(speed) {
/*
  var f = this.eye.subtract(this.at);
  f=f.divide(f.length());
  var s=f.cross(this.up);
  s=s.divide(s.length());
  this.at=this.at.add(s);
  this.eye=this.eye.add(s);
*/
  let f = new Vector3(this.at.elements);
  f.sub(this.eye);
  let s = Vector3.cross(this.up, f);
  s.normalize();
  s.mul(speed);
  this.eye.add(s);
  this.at.add(s);

}

right(speed) {
/*
  var f = this.eye.subtract(this.at);
  f=f.divide(f.length());
  var s=this.up.cross(f);
  s=s.divide(s.length());
  this.at=this.at.add(s);
  this.eye=this.eye.add(s);
*/
  let f = new Vector3(this.at.elements);
  f.sub(this.eye);
  let s = Vector3.cross(f, this.up);
  s.normalize();
  s.mul(speed);
  this.eye.add(s);
  this.at.add(s);
}

panLeft(alpha) {
  let f = new Vector3(this.at.elements);
  f.sub(this.eye);
  let rotationMatrix = new Matrix4();
  rotationMatrix.setRotate(alpha, this.up.getX(), this.up.getY(), this.up.getZ());
  let f_prime = rotationMatrix.multiplyVector3(f);
  this.at.set(this.eye);
  this.at.add(f_prime);
}

panRight(alpha) {
  this.panLeft(-alpha)
}

panDown(alpha) {
  let f = new Vector3(this.at.elements);
    f.sub(this.eye);

    // Compute the right vector for correct rotation
    let s = Vector3.cross(this.up, f);
    s.normalize();

    let rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(-alpha, s.elements[0], s.elements[1], s.elements[2]);

    let f_prime = rotationMatrix.multiplyVector3(f);
    this.at.set(this.eye);
    this.at.add(f_prime);

}

panUp(alpha) {
  let f = new Vector3(this.at.elements);
    f.sub(this.eye);

    // Compute the right vector for correct rotation
    let s = Vector3.cross(this.up, f);
    s.normalize();

    let rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(alpha, s.elements[0], s.elements[1], s.elements[2]);

    let f_prime = rotationMatrix.multiplyVector3(f);
    this.at.set(this.eye);
    this.at.add(f_prime);

}

}