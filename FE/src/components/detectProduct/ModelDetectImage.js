import React, { useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

const ProductClassifier = () => {
    const [prediction, setPrediction] = useState('');
    const imageRef = useRef();

    const loadModel = async () => {
        const model = await mobilenet.load();
        return model;
    };

    const classifyImage = async () => {
        const model = await loadModel();
        const img = imageRef.current;
        const tfImg = tf.browser.fromPixels(img);
        const resizedImg = tf.image.resizeBilinear(tfImg, [224, 224]);
        const processedImg = tf.cast(resizedImg, 'float32');
        const batchedImg = processedImg.expandDims(0);
        const prediction = await model.classify(batchedImg);
        setPrediction(prediction[0].className);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            imageRef.current.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{marginBottom: 40}}>
            <input type="file" onChange={handleImageUpload} />
            <button onClick={classifyImage}>Classify</button>
            <img ref={imageRef} alt="Uploaded" />
            {prediction && <p>Prediction: {prediction}</p>}
        </div>
    );
};

export default ProductClassifier;
