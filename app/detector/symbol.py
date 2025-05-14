from ultralytics import YOLO
import numpy as np
import cv2

# Load pretrained model — we'll replace with custom weights later
model = YOLO("yolov8n.pt")

def detect_symbols(image_bytes: bytes):
    # Convert bytes to image (OpenCV format)
    np_arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Run inference
    results = model.predict(source=image, imgsz=640, conf=0.25, verbose=False)

    # Collect structured results
    detections = []
    for r in results:
        for box in r.boxes:
            class_id = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = list(map(float, box.xyxy[0]))  # [x1, y1, x2, y2]

            detections.append({
                "class": model.names[class_id],
                "confidence": round(conf, 4),
                "bbox": xyxy
            })

    return detections