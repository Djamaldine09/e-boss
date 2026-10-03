import os
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import shutil
from pathlib import Path

# Configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

# Créer le dossier de téléchargement s'il n'existe pas
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

async def save_uploaded_files(files: List[UploadFile]) -> List[dict]:
    saved_files = []
    
    for file in files:
        if not file.filename or not allowed_file(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"Type de fichier non autorisé pour {file.filename}. Types autorisés: {', '.join(ALLOWED_EXTENSIONS)}"
            )
            
        # Lire le contenu pour vérifier la taille
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Le fichier {file.filename} dépasse la taille maximale autorisée de 5MB"
            )
            
        # Générer un nom de fichier unique
        file_ext = file.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Sauvegarder le fichier
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
            
        saved_files.append({
            "filename": filename,
            "original_name": file.filename,
            "content_type": file.content_type,
            "size": len(contents),
            "url": f"/{UPLOAD_DIR}/{filename}"
        })
        
        # Réinitialiser le curseur du fichier
        await file.seek(0)
        
    return saved_files

# Route pour le téléchargement de fichiers
async def handle_file_upload(files: List[UploadFile] = File(...)):
    try:
        if not files:
            raise HTTPException(status_code=400, detail="Aucun fichier fourni")
            
        saved_files = await save_uploaded_files(files)
        
        return {
            "message": "Fichiers téléchargés avec succès",
            "files": saved_files
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du téléchargement des fichiers: {str(e)}")
