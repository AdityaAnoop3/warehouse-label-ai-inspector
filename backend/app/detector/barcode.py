import cv2
import numpy as np
from pyzbar.pyzbar import decode

def detect_barcode(image_bytes: bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    barcodes = decode(img)
    results = []

    for barcode in barcodes:
        results.append({
            "type": barcode.type,
            "data": barcode.data.decode("utf-8"),
            "position": barcode.rect
        })

    return results