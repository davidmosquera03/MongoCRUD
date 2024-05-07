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

@lib.get('/loans',tags=["Prestamos"])
def find_all_loans():
    return prestamosEntity(conn.biblioteca.prestamo.find())

@lib.get('/loans/{isbn}/{num}/{rut}',tags=["Prestamos"])
def find_loan(isbn:str,numero:int,rut:str):
     return prestamoEntity(conn.biblioteca.prestamo.find_one(
         {"isbn": isbn,"numero":numero,"rut":rut})
         )
@lib.get('/autorear',tags=["Autorear"])
def find_all_autorear():
    return autorearEntities(conn.biblioteca.autorear.find())

@lib.get('/autorear/{titulo}/{nombre}',tags=["Autorear"])
def find_autorear(titulo:str,nombre:str):
    return autorearEntity(conn.biblioteca.autorear.find_one(
        {"titulo":titulo,"nombre":nombre}
    ))

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

@lib.post('/loans',tags=["Prestamos"])
def create_loan(prestamo:Prestamo):
    new = dict(prestamo)
    conn.biblioteca.prestamo.insert_one(new)
    creado = conn.biblioteca.prestamo.find_one({"isbn": new["isbn"],"numero":new["numero"],"rut":new["rut"]})
    return prestamoEntity(creado)

@lib.post('/autorear',tags=["Autorear"])
def create_autorear(autorear:Autorear):
    new = dict(autorear)
    conn.biblioteca.autorear.insert_one(new)
    creado = conn.biblioteca.autorear.find_one({"titulo":new["titulo"],"nombre":new["nombre"]})
    return autorearEntity(creado)

#PUTs Actualizar
@lib.put('/users/{rut}',tags=["Usuarios"])
def update_user(rut:str,usuario:Usuario):
    conn.biblioteca.usuario.find_one_and_update({
        "rut":rut
    },  {"$set": dict(usuario)}
    )
    return  usuarioEntity(conn.biblioteca.usuario.find_one({"rut":usuario.rut}))

@lib.put('/authors/{nombre}',tags=["Autores"])
def update_author(nombre:str,autor:Autor):
    conn.biblioteca.autor.find_one_and_update({
        "nombre":nombre
    },  {"$set": dict(autor)}
    )
    return  autorEntity(conn.biblioteca.autor.find_one({"nombre":autor.nombre}))

@lib.put('/books/{titulo}',tags=["Libros"])
def update_book(titulo:str,libro:Libro):
    conn.biblioteca.libro.find_one_and_update({
        "titulo":titulo
    },  {"$set": dict(libro)}
    )
    return  libroEntity(conn.biblioteca.libro.find_one({"titulo":libro.titulo}))

@lib.put('/editions/{isbn}',tags=["Ediciones"])
def update_edition(isbn:str,edicion:Edicion):
    conn.biblioteca.edicion.find_one_and_update({
        "isbn":isbn
    },  {"$set": dict(edicion)}
    )
    return  edicionEntity(conn.biblioteca.edicion.find_one({"isbn":edicion.isbn}))

@lib.put('/copies/{isbn}/{numero}',tags=["Copias"])
def update_copy(isbn:str,numero:int,copia:Copia):
    conn.biblioteca.copia.find_one_and_update({
        "isbn":isbn,
        "numero":numero
    },  {"$set": dict(copia)}
    )
    return  copiaEntity(conn.biblioteca.copia.find_one({"isbn":copia.isbn,"numero":copia.numero}))

@lib.put('/copies/{isbn}/{numero}/{rut}',tags=["Prestamos"])
def update_loan(isbn:str,numero:int,rut:str,prestamo:Prestamo):
    conn.biblioteca.prestamo.find_one_and_update({
        "isbn":isbn,
        "numero":numero,
        "rut":rut
    },  {"$set": dict(prestamo)}
    )
    return  prestamoEntity(conn.biblioteca.prestamo.find_one(
        {"isbn":prestamo.isbn,"numero":prestamo.numero,"rut":prestamo.rut}))

@lib.put('/autorear/{titulo}/{nombre}',tags=["Autorear"])
def update_autorear(titulo:str,nombre:str,autorear:Autorear):
    conn.biblioteca.autorear.find_one_and_update({
        "titulo":titulo,
        "nombre":nombre
    },  {"$set": dict(autorear)})
    return autorearEntity(conn.biblioteca.autorear.find_one({"titulo":autorear.titulo,"nombre":autorear.nombre}))
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

@lib.delete('/loans/{isbn}/{num}/{rut}',tags=["Prestamos"])
def delete_copy(isbn:str,numero:int,rut:str):
    conn.biblioteca.prestamo.delete_one({"isbn":isbn,"numero":numero,"rut":rut})
    return f"deleted {isbn}/{numero}/{rut}"

@lib.delete('/autorear/{titulo}/{nombre}',tags=["Autorear"])
def delete_autorear(titulo:str,nombre:str):
    conn.biblioteca.autorear.delete_one({"titulo":titulo,"nombre":nombre})
    return f"deleted {titulo}/{nombre}"

""" #update
@user.put('/users({id})')
def update_user(id:str,user:User):
    conn.local.user.find_one_and_update({
        "_id": ObjectId(id)
    },  {"$set": dict(user)}
    )
    return  userEntity(conn.local.user.find_one({"_id": ObjectId(id)}))

 """
