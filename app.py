from fastapi import FastAPI
from routes.user import lib
from tags import tags_metadata
# uvicorn app:app --reload

app = FastAPI(
    title="MongoDB CRUD Bilioteca",
  description="Manejo de prestamo en biblioteca",
  version="0.0.1",
  openapi_tags=tags_metadata

)

#incluir ruta
app.include_router(lib)
