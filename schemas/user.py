
#Devolver un documento
def usuarioEntity(item) -> dict:
    return {
        "rut":item["rut"],
        "nombre":item["nombre"]
    }

def autorEntity(item)-> dict:
    return {
        "nombre":item["nombre"]
    }

def libroEntity(item)-> dict:
    return {
        "titulo":item["titulo"],
        "isbn":item["isbn"]
    }

def edicionEntity(item)->dict:
    return {
        "isbn":item["isbn"],
        "anyo":item["anyo"],
        "idioma":item["idioma"]
    }
def copiaEntity(item)->dict:
    return {
        "numero":item["numero"],
        "isbn":item["isbn"]
    }

def prestamoEntity(item)->dict:
    return {
        "numero": item["numero"],
        "isbn": item["isbn"],
        "rut": item["rut"],
        "fecha_dev": item["fecha_dev"],
        "fecha_pres":item["fecha_pres"],
    }

def autorearEntity(item)->dict:
    return {
        "titulo":item["titulo"],
        "nombre":item["nombre"]
    }


#Devolver collection
def usuariosEntity(entity)->list:
    return [usuarioEntity(item) for item in entity]

def autoresEntity(entity)->list:
    return [autorEntity(item) for item in entity]

def librosEntity(entity)->list:
    return [libroEntity(item) for item in entity]

def edicionesEntity(entity)->list:
    return [edicionEntity(item) for item in entity]

def copiasEntity(entity)->list:
    return [copiaEntity(item) for item in entity]

def prestamosEntity(entity)->list:
     return [prestamoEntity(item) for item in entity]

def autorearEntities(entity)->list:
    return [autorearEntity(item) for item in entity]
