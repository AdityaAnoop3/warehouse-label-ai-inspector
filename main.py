from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Warehouse Symbol AI Inspector")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Warehouse AI Symbol API is running"}