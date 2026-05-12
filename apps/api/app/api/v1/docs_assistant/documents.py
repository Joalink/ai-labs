import shutil

from app.services.docs_assistant.ingestion import ingest_pdf
from fastapi import APIRouter, HTTPException, UploadFile

router = APIRouter()


@router.post("/documents", status_code=201)
async def documents(file: UploadFile):

    try:
        path = f"data/{file.filename}"

        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        ingest_pdf(path)

        return {"message": "File uploaded", "namespace": path}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
