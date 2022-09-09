from keras.models import load_model
import cv2
import numpy as np
import sys
import io
# from imageio import imread
import imageio.v2 as imageio
import base64
import os
MODEL_PATH = './emotion_model'
emotion_dict = {0: "angry", 1: "disgust", 2: "fear", 3: "happy", 4: "sad", 5: "surprise", 6: "neutral"}

model = load_model(MODEL_PATH)

filepath = sys.argv[1]

with open(filepath, "r") as f:
    data = f.read()

images = data.split(";")
for image in images:
    if image:
        img = imageio.imread(io.BytesIO(base64.b64decode(image)))
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y + h, x:x + w]
            cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0)
            cv2.normalize(cropped_img, cropped_img, alpha=0, beta=1, norm_type=cv2.NORM_L2, dtype=cv2.CV_32F)
            prediction = model.predict(cropped_img)
            
            print(emotion_dict[int(np.argmax(prediction))])
            # write to file
            with open("emotion.txt", "w") as f:
                f.write(emotion_dict[int(np.argmax(prediction))])
            break
    break


