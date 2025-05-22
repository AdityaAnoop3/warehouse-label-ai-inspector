from ultralytics import YOLO
from fastapi import UploadFile
import numpy as np
import cv2

# Load pretrained model — we'll replace with custom weights later
model = YOLO("models/yolov8n-trained.pt")

def detect_symbols(file: UploadFile):
    image_bytes = file.file.read()
    np_arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Run inference
    results = model(image)[0]
    detections = []
    for box in results.boxes:
        class_id = int(box.cls[0])
        conf = float(box.conf[0])
        #if conf < 0.7:
            #continue
        x1, y1, x2, y2 = map(float, box.xyxy[0])

        detections.append({
            "class": model.names[class_id],
            "confidence": round(conf, 4),
            "bbox": [x1, y1, x2, y2]
            })

    return detections