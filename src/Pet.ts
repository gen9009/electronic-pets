import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// 定义宠物
interface PetOptions {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  controls?: OrbitControls;
}
class Pet {
  private src: string;
  private loader: GLTFLoader;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLCanvasElement;
  private camera: THREE.Camera;
  private controls?: OrbitControls;
  private model: THREE.Object3D | null;
  // 回调函数
  public onClick: (event: MouseEvent, model: THREE.Object3D) => void;
  public onRightClick: (event: PointerEvent, model: THREE.Object3D) => void;
  public onDoubleClick: () => void;
  public onProgress: (progress: number) => void;
  public onSuccess: (model: THREE.Object3D) => void;
  public onError: (error: any) => void;
  constructor(src: string, options: PetOptions) {
    const { scene, renderer, camera, controls } = options
    this.src = src;
    this.loader = new GLTFLoader();
    this.scene = scene;
    this.renderer = renderer;
    this.container = this.renderer.domElement
    this.camera = camera;
    this.controls = controls
    this.model = null;

    this.onClick = () => { };
    this.onRightClick = () => { };
    this.onDoubleClick = () => { };
    this.onProgress = () => { };
    this.onSuccess = () => { };
    this.onError = () => { };

    this.init();
  }

  private init() {
    // 创建 DRACOLoader 实例
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.loader.setDRACOLoader(dracoLoader)
    // 加载模型
    this.loader.load(
      this.src,
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
        this.onSuccess(this.model);
      },
      (xhr) => {
        this.onProgress(xhr.loaded / xhr.total);
      },
      (error) => {
        this.onError(error);
      }
    );

    // 添加点击
    this.renderer.domElement.addEventListener('click', this.handleClick.bind(this));
    // 添加双击
    this.renderer.domElement.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    // 添加右键
    this.renderer.domElement.addEventListener('contextmenu', this.handleRightEvent.bind(this));

    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    this.controls?.update()
    this.renderer.render(this.scene, this.camera);
  }

  private handleClick(event: MouseEvent) {
    if (!this.model) return;

    // 获取点击位置的坐标
    const containerRect = this.container.getBoundingClientRect();
    const offsetX = containerRect.left;
    const offsetY = containerRect.top;

    const mouse = new THREE.Vector2(
      ((event.clientX - offsetX) / this.container.offsetWidth) * 2 - 1,
      -((event.clientY - offsetY) / this.container.offsetHeight) * 2 + 1
    );
    // 创建射线投射器
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // 检查射线是否与模型相交
    const intersects = raycaster.intersectObject(this.model, true);

    // 如果有相交，触发点击事件
    if (intersects.length > 0) {
      this.onClick(event, this.model);
    }
  }

  private handleDoubleClick(event: MouseEvent) {
    if (!this.model) return;

    // 获取点击位置的坐标
    const containerRect = this.container.getBoundingClientRect();
    const offsetX = containerRect.left;
    const offsetY = containerRect.top;

    const mouse = new THREE.Vector2(
      ((event.clientX - offsetX) / this.container.offsetWidth) * 2 - 1,
      -((event.clientY - offsetY) / this.container.offsetHeight) * 2 + 1
    );
    // 创建射线投射器
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // 检查射线是否与模型相交
    const intersects = raycaster.intersectObject(this.model, true);

    // 如果有相交，触发双击事件
    if (intersects.length > 0) {
      this.onDoubleClick();
    }
  }
  private handleRightEvent(event: PointerEvent) {
    if (!this.model) return;

    // 获取点击位置的坐标
    const containerRect = this.container.getBoundingClientRect();
    const offsetX = containerRect.left;
    const offsetY = containerRect.top;

    const mouse = new THREE.Vector2(
      ((event.clientX - offsetX) / this.container.offsetWidth) * 2 - 1,
      -((event.clientY - offsetY) / this.container.offsetHeight) * 2 + 1
    );

    // 创建射线投射器
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // 检查射线是否与模型相交
    const intersects = raycaster.intersectObject(this.model, true);

    // 如果有相交，触发双击事件
    if (intersects.length > 0) {
      this.onRightClick(event, this.model);
    }
  }

  public getModel(): THREE.Object3D | null {
    return this.model;
  }


}

export default Pet;
