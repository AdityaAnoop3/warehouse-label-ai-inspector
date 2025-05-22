from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="Warehouse Symbol AI Inspector")

# Apply CORS so your Next.js frontend at localhost:3000 can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes defined in app/api/routes.py
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Warehouse AI Symbol API is running"}