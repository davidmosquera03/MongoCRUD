from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes.user import lib
from tags import tags_metadata
import uvicorn
# uvicorn app:app --reload

app = FastAPI(
    title="MongoDB CRUD Biblioteca",
    description="Manejo de préstamo en biblioteca",
    version="0.0.1",
    openapi_tags=tags_metadata
)

# Incluir ruta de usuario
app.include_router(lib)

# Servir archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Esto permite todas las orígenes en desarrollo
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
