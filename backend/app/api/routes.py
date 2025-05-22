from fastapi import APIRouter, UploadFile, File
from app.detector.barcode import detect_barcode
from app.detector.symbol import detect_symbols

router = APIRouter()

@router.post("/detect/barcode/")
async def barcode_detection(file: UploadFile = File(...)):
    contents = await file.read()
    result = detect_barcode(contents)
    return {"result": result}

@router.post("/detect/symbol/")
async def symbol_detection(file: UploadFile = File(...)):
    results = detect_symbols(file)
    return {"result": results}