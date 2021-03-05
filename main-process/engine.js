require('onnxjs');
// Use package 'onnxjs-node' to load ONNXRuntime backend.
require('onnxjs-node');

const path = require('path')
var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var Jimp = require('jimp');

function imagenetNormalize(data) {
  // Normalize
  ops.divseq(data.pick(null, null, null), 255.0);
  ops.subseq(data.pick(0, null, null), 0.485);
  ops.subseq(data.pick(1, null, null), 0.456);
  ops.subseq(data.pick(2, null, null), 0.406);
  ops.divseq(data.pick(0, null, null), 0.229);
  ops.divseq(data.pick(1, null, null), 0.224);
  ops.divseq(data.pick(2, null, null), 0.225);
}


function saveImg(dataTensor, savePath) {
  let width = dataTensor.dims[3]
  let height = dataTensor.dims[2]
  const dataImage = ndarray(new Uint8Array(height * width * 4), [height, width, 4]);
  const dataModel = ndarray(new Uint8Array(dataTensor.data), [1, 3, height, width]);

  ops.assign(dataImage.pick(null, null, 0), dataModel.pick(0, 0, null, null));
  ops.assign(dataImage.pick(null, null, 1), dataModel.pick(0, 1, null, null));
  ops.assign(dataImage.pick(null, null, 2), dataModel.pick(0, 2, null, null));
  ops.assigns(dataImage.pick(null, null, 3), 255);

  new Jimp({ data: dataImage.data, width: width, height: height }, (err, image) => {
    image.write(savePath);
  });
}


class Engine {
  // constructor
  constructor(backend = 'onnxruntime') {
    this.session = new onnx.InferenceSession({ backendHint: backend });
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
    const x = await this.preprocess(imgPath)
    const outputMap = await this.session.run([x]);
    const output = this.postprocess(outputMap)
    return output;
  }
}


async function test() {
  const engine = new Engine();
  await engine.loadModel(path.join(__dirname, "../models/candy-9.onnx"))
  const outputTensor = await engine.run(path.join(__dirname, "../logs/img_snow.jpg"))
  saveImg(outputTensor, path.join(__dirname, "../logs/out.jpg"))
}

test();