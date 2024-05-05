from fastapi import FastAPI
from routes.user import lib
# uvicorn app:app --reload

app = FastAPI()

#incluir ruta
app.include_router(lib)
