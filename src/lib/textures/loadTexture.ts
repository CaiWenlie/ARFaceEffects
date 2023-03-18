import * as THREE from 'three'
import { TextureLoader } from 'three'

export function loadTexture(textureLoader: TextureLoader, path: string) {
  const texture = textureLoader.load(path)
  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;

  // reduce blurring at glancing angles
  texture.anisotropy = 16;
  const alpha = 0.4;
  const beta = 0.5;
	// const material = new THREE.MeshPhongMaterial({
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: new THREE.Color(0xffffff),
    // specular: new THREE.Color(beta * 0.2, beta * 0.2, beta * 0.2),
    reflectivity: beta,
    // shininess: Math.pow(2, alpha * 10),
  });

  return material
}