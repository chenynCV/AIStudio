require('onnxjs');
// Use package 'onnxjs-node' to load ONNXRuntime backend.
require('onnxjs-node');

const path = require('path')
var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var Jimp = require('jimp');


function normalize(data) {
  // Normalize
  ops.divseq(data.pick(null, null, null), 255.0);
  ops.subseq(data.pick(0, null, null), 0.485);
  ops.subseq(data.pick(1, null, null), 0.456);
  ops.subseq(data.pick(2, null, null), 0.406);
  ops.divseq(data.pick(0, null, null), 0.229);
  ops.divseq(data.pick(1, null, null), 0.224);
  ops.divseq(data.pick(2, null, null), 0.225);
}


function preprocess(img) {
  let width = img.bitmap.width
  let height = img.bitmap.height
  let data = img.bitmap.data
  const dataFromImage = ndarray(new Float32Array(data), [4, height, width]);
  const dataProcessed = ndarray(new Float32Array(height * width * 3), [1, 3, height, width]);

  ops.assign(dataProcessed.pick(0, 0, null, null), dataFromImage.pick(0, null, null));
  ops.assign(dataProcessed.pick(0, 1, null, null), dataFromImage.pick(1, null, null));
  ops.assign(dataProcessed.pick(0, 2, null, null), dataFromImage.pick(2, null, null));

  return dataProcessed.data;
}


function saveImg(data, img) {
  let width = img.bitmap.width
  let height = img.bitmap.height
  const dataImage = ndarray(new Uint8Array(4 * height * width), [4, height, width]);
  const dataModel = ndarray(new Uint8Array(data), [3, height, width]);

  ops.assign(dataImage.pick(0, null, null), dataModel.pick(0, null, null));
  ops.assign(dataImage.pick(1, null, null), dataModel.pick(1, null, null));
  ops.assign(dataImage.pick(2, null, null), dataModel.pick(2, null, null));
  ops.assigns(dataImage.pick(3, null, null), 255);

  const imgPath = path.join(__dirname, "../logs/modelOut.jpg");
  img.bitmap.data = dataImage.data
  img.write(imgPath);
}


async function main() {
  // Create an ONNX inference session with ONNXRuntime backend.
  const session = new onnx.InferenceSession({ backendHint: 'onnxruntime' });

  // Load an ONNX model. This model takes two tensors of the same size and return their sum.
  const modelPath = path.join(__dirname, "../models/rain_princess.onnx");
  await session.loadModel(modelPath);

  const imgPath = path.join(__dirname, "../logs/000.png");
  const img = await Jimp.read(imgPath);
  await img.resize(224, 224, Jimp.RESIZE_BICUBIC);

  const x = preprocess(img);
  const tensorX = new onnx.Tensor(x, 'float32', [1, 3, 224, 224]);

  // Run model with Tensor inputs and get the result by output name defined in model.
  const outputMap = await session.run([tensorX]);
  const outputData = outputMap.values().next().value.data;
  saveImg(outputData, img.clone())
}

main();