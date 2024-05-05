from fastapi import APIRouter
from config.db import conn
from schemas.user import *
from models.user import Usuario,Prestamo,Libro,Copia,Edicion,Autor,Autorear
from bson import ObjectId

# define rutas
lib = APIRouter()

#conn.[database].[collectionName]

#GETs Encontrar
@lib.get('/users',tags=["Usuarios"])
def find_all_users():
    return usuariosEntity(conn.biblioteca.usuario.find())

@lib.get('/users/{rut}',tags=["Usuarios"])
def find_user(rut:str):
     return usuarioEntity(conn.biblioteca.usuario.find_one(
         {"rut": rut})
         )

@lib.get('/books',tags=["Libros"])
def find_all_books():
    return librosEntity(conn.biblioteca.libro.find())

@lib.get('/books/{titulo}',tags=["Libros"])
def find_book(titulo:str):
     return libroEntity(conn.biblioteca.libro.find_one(
         {"titulo": titulo})
         )

@lib.get('/authors',tags=["Autores"])
def find_all_authors():
    return autoresEntity(conn.biblioteca.autor.find())

@lib.get('/authors/{nombre}',tags=["Autores"])
def find_author(nombre:str):
     return autorEntity(conn.biblioteca.autor.find_one(
         {"nombre": nombre})
         )

@lib.get('/editions',tags=["Ediciones"])
def find_all_editions():
    return edicionesEntity(conn.biblioteca.edicion.find())

@lib.get('/editions/{isbn}',tags=["Ediciones"])
def find_edition(isbn:str):
     return edicionEntity(conn.biblioteca.edicion.find_one(
         {"isbn": isbn})
         )

@lib.get('/copies',tags=["Copias"])
def find_all_copies():
    return copiasEntity(conn.biblioteca.copia.find())

@lib.get('/copies/{isbn}/{num}',tags=["Copias"])
def find_copy(isbn:str,numero:int):
     return copiaEntity(conn.biblioteca.copia.find_one(
         {"isbn": isbn,"numero":numero})
         )
#POSTs Insertar

@lib.post('/users',tags=["Usuarios"])
def create_user(usuario:Usuario):
    new_user = dict(usuario)
    conn.biblioteca.usuario.insert_one(new_user)
    creado = conn.biblioteca.usuario.find_one({"rut":new_user["rut"]})
    return usuarioEntity(creado)

@lib.post('/authors',tags=["Autores"])
def create_autor(autor:Autor):
    new = dict(autor)
    conn.biblioteca.autor.insert_one(new)
    creado = conn.biblioteca.autor.find_one({"nombre":new["nombre"]})
    return autorEntity(creado)

@lib.post('/books',tags=["Libros"])
def create_book(libro:Libro):
    new = dict(libro)
    conn.biblioteca.libro.insert_one(new)
    creado = conn.biblioteca.libro.find_one({"titulo":new["titulo"]})
    return libroEntity(creado)

@lib.post('/editions',tags=["Ediciones"])
def create_edition(edicion:Edicion):
    new = dict(edicion)
    conn.biblioteca.edicion.insert_one(new)
    creado = conn.biblioteca.edicion.find_one({"isbn":new["isbn"]})
    return edicionEntity(creado)

@lib.post('/copies',tags=["Copias"])
def create_copy(copia:Copia):
    new = dict(copia)
    conn.biblioteca.copia.insert_one(new)
    creado = conn.biblioteca.copia.find_one({"isbn": new["isbn"],"numero":new["numero"]})
    return copiaEntity(creado)
#PUTs Actualizar

#DELETEs Borrar
@lib.delete('/users/{rut}',tags=["Usuarios"])
def delete_user(rut:str):
    conn.biblioteca.usuario.delete_one({"rut":rut})
    return f"deleted {rut}"

@lib.delete('/authors/{nombre}',tags=["Autores"])
def delete_author(nombre:str):
    conn.biblioteca.autor.delete_one({"nombre":nombre})
    return f"deleted {nombre}"

@lib.delete('/books/{titulo}',tags=["Libros"])
def delete_book(titulo:str):
    conn.biblioteca.libro.delete_one({"titulo":titulo})
    return f"deleted {titulo}"

@lib.delete('/editions/{isbn}',tags=["Ediciones"])
def delete_edition(isbn:str):
    conn.biblioteca.edicion.delete_one({"isbn":isbn})
    return f"deleted {isbn}"

@lib.delete('/copies/{isbn}/{num}',tags=["Copias"])
def delete_copy(isbn:str,numero:int):
    conn.biblioteca.copia.delete_one({"isbn":isbn,"numero":numero})
    return f"deleted {isbn}/{numero}"

""" #update
@user.put('/users({id})')
def update_user(id:str,user:User):
    conn.local.user.find_one_and_update({
        "_id": ObjectId(id)
    },  {"$set": dict(user)}
    )
    return  userEntity(conn.local.user.find_one({"_id": ObjectId(id)}))


#delete
@user.delete('/users({id})')
def delete_user(id:str):
    conn.local.user.delete_one({"_id":ObjectId(id)})
    return f"deleted {id}"
 """
