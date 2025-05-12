from fastapi import APIRouter, UploadFile, File
from app.detector.barcode import detect_barcode

router = APIRouter()

@router.post("/detect/barcode/")
async def barcode_detection(file: UploadFile = File(...)):
    contents = await file.read()
    result = detect_barcode(contents)
    return {"result": result}