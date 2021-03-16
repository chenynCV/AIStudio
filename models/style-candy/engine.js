require('onnxjs');
// Use package 'onnxjs-node' to load ONNXRuntime backend.
require('onnxjs-node');

const path = require('path')
var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var Jimp = require('jimp');

class Engine {
  // constructor
  constructor(modelPath = path.join(__dirname, "candy-9.onnx"), backend = 'onnxruntime') {
    this.session = new onnx.InferenceSession({ backendHint: backend });
    this.modelPath = modelPath
    this.firstRun = true
  }

  async loadModel(modelPath) {
    this.session.loadModel(modelPath);
  }

  async preprocess(imgPath, width = 224, height = 224) {
    const img = await Jimp.read(imgPath);
    await img.resize(width, height, Jimp.RESIZE_BICUBIC);

    let data = img.bitmap.data
    const dataFromImage = ndarray(new Float32Array(data), [height, width, 4]);
    const dataProcessed = ndarray(new Float32Array(height * width * 3), [1, 3, height, width]);

    ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(null, null, 0));
    ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(null, null, 1));
    ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(null, null, 2));

    const x = new onnx.Tensor(dataProcessed.data, 'float32', [1, 3, height, width]);
    return x;
  }

  postprocess(outputMap) {
    const output = outputMap.values().next().value;
    return output;
  }

  async run(imgPath) {
    console.log(imgPath)
    if (this.firstRun) {
      await this.loadModel(this.modelPath)
      this.firstRun = false
    }
    const x = await this.preprocess(imgPath)
    console.log("model runing...")
    const outputMap = await this.session.run([x]);
    const output = this.postprocess(outputMap)
    console.log("model done.")
    return output;
  }
}


async function test() {
  const engine = new Engine();
  const outputTensor = await engine.run(path.join(__dirname, "logs/img_snow.jpg"))
}


module.exports = Engine;