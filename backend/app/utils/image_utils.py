import cv2
import numpy as np

def convert_to_grayscale(image: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def resize_image(image: np.ndarray, width: int, height: int) -> np.ndarray:
    return cv2.resize(image, (width, height))

def add_bounding_boxes(image: np.ndarray, boxes: list) -> np.ndarray:
    for box in boxes:
        x, y, w, h = box['position']
        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
    return image